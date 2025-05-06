import { Component, inject } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { NoteService } from '../../services/note.service';
import { marked } from 'marked';
import {baseUrl} from "marked-base-url";
import { markedHighlight } from "marked-highlight";
import hljs from 'highlight.js';
import { getHeadingList, gfmHeadingId, HeadingData } from "marked-gfm-heading-id";
import { NzAnchorModule } from 'ng-zorro-antd/anchor';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


export class AnchorHeader{
    headerText: string = ""
    level:number = 0;
    id: string = "";
    children: AnchorHeader[] = [];
    constructor(value: Partial<AnchorHeader>){
        Object.assign(this, value);
    }
}


let headers: HeadingData[] =[]

marked.use(gfmHeadingId({prefix: "my-prefix-"}), {
	hooks: {
		postprocess: (html) => {
			headers = getHeadingList();

			return html;
		}
	}
});

marked.use(
  markedHighlight({
    emptyLangClass: 'hljs',
      langPrefix: 'hljs language-',
      highlight(code, lang, info) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      }
    })
)

@Component({
  selector: 'app-note',
  imports: [NzAnchorModule],
  templateUrl: './note.component.html',
  styleUrl: './note.component.less'
})
export class NoteComponent {
  noteService = inject(NoteService)
  fullPath: string[] = [];
  mdFileStr: SafeHtml ="";

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.route.url.subscribe((segments: UrlSegment[]) => {
      this.fullPath = segments.map(seg => seg.path);
    });
    this.noteService.onFileSelected.subscribe(file => {
      if(this.noteService.currentSelecteFile){
        marked.use(baseUrl(this.noteService.currentSelecteFile.filePath));
        this.noteService.loadCurrentMDDoc().subscribe(mdFileStr=>{
          this.convertMdToHtml(mdFileStr);
        })
      }
    })
  }

  convertMdToHtml(mdStr: string) {
    this.mdFileStr = this.sanitizer.bypassSecurityTrustHtml( marked(mdStr, {async:false}));
  }

  createNestedHeaders(): AnchorHeader[] {
    const dummy = new AnchorHeader({ level: 0, children: [] });
    const stack = [dummy]; // 使用栈维护当前路径的父节点

    for (const header of headers) {
        const currentNode = new AnchorHeader({
            headerText: header.text,
            level: header.level,
            id: header.id,
            children: []
        });

        // 弹出栈顶直到找到层级小于当前节点的父节点
        while (stack[stack.length - 1].level >= currentNode.level) {
            stack.pop();
        }

        // 当前节点的父节点是栈顶元素
        stack[stack.length - 1].children.push(currentNode);
        stack.push(currentNode); // 将当前节点压入栈，作为后续可能的父节点
    }

    return dummy.children;
  }
}
