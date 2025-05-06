import { HttpClient } from '@angular/common/http';
import { EventEmitter, inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from '../../environment';


export class MarkdownNoteFile {
  fileName: string = ""
  filePath: string = ""
  constructor(value: Partial<MarkdownNoteFile>){
    Object.assign(this, value);
  }
}

export class NoteMenu {
  router: string = ""
  title: string = ""
  folder: string = ""
  subMenu: NoteMenu[] = []
  noteFiles: MarkdownNoteFile[] = []
  constructor(value: Partial<NoteMenu>){
    Object.assign(this, value);
  }
}

export class APIResponse<T> {
  succeed: boolean = false
  data: T | null = null
  errorMessage: string = ""
}
@Injectable({
  providedIn: 'root'
})
export class NoteService {
  messageService = inject(NzMessageService)

  onFileSelected: EventEmitter<MarkdownNoteFile> = new EventEmitter<MarkdownNoteFile>();
  constructor(private http: HttpClient){}
isCurrentNoteSelected(currentFile: MarkdownNoteFile): boolean {
  if(this.selectedMenus.length === 0){
    return false;
  }
  let endMenu = this.selectedMenus[this.selectedMenus.length - 1];
  let index = endMenu.noteFiles.findIndex((file) => {
    if(file.filePath === currentFile.filePath){
      return true;
    }
    return false;
  })
  return index !== -1;
}
  selectedMenus: NoteMenu[] = [];
  currentSelecteFile?: MarkdownNoteFile
  isCurrentMenuSelectedOrOpened(currentMenu: NoteMenu):boolean{
    let index = this.selectedMenus.findIndex((menu) => {
      if(menu.router === currentMenu.router){
        return true;
      }
      return false;
    })
    return index !== -1;
  }
  setSelectFile(currentFile: MarkdownNoteFile):void{
    this.currentSelecteFile = currentFile;
    this.onFileSelected.emit(this.currentSelecteFile);
  }
  setSelectMenu(currentMenu: NoteMenu):void{
    let possiableMenuChain: NoteMenu[] = []

    let nestedFound = function(menu: NoteMenu, currentMenu:NoteMenu, possiableMenuChain: NoteMenu[]): boolean{
      if(menu.subMenu.length === 0){
        return false;
      }
      for(let subMenu of menu.subMenu){
        possiableMenuChain.push(subMenu);
        if(subMenu.router === currentMenu.router){
          return true;
        }else{
          let found = nestedFound(subMenu, currentMenu, possiableMenuChain);
          if(found){
            return true;
          }else{
            possiableMenuChain.pop();
          }
        }
      }
      return false;
    }
    let homeMenu = new NoteMenu({
      router: "/",
      title: "Home",
      folder: "note",
      subMenu: this.NoteMenus,
      noteFiles: []
    });
    possiableMenuChain.push(homeMenu);
    nestedFound(homeMenu, currentMenu, possiableMenuChain);
    this.selectedMenus = possiableMenuChain;
    console.log(this.selectedMenus);
  }

  loadCurrentMDDoc(){
    if(this.currentSelecteFile){
      return this.http.get("" + this.currentSelecteFile.filePath + this.currentSelecteFile.fileName, { 
        responseType: 'text',
        headers: { 'Content-Type': 'text/markdown; charset=utf-8' }
      });
    }else{
      return new Observable<string>();
    }
    
  }

  loadNoteMenu(){
    this.http.get<APIResponse<NoteMenu[]>>(`${environment.serviceUrl}Note`).subscribe({
      next: (response) => {
          if(response.succeed && response.data){
            this.NoteMenus = response.data;
          }else{
            this.messageService.error("加载笔记菜单失败");
          }
      }, error: (err) => {
        this.messageService.error(`error: ${err.message}`);
      }
    })
  }
  NoteMenus: NoteMenu[] = [];
  // NoteMenus: NoteMenu[] = [
  //   new NoteMenu({
  //     Router: "angular",
  //     Title: "Angular",
  //     Folder: "notes/angular",
  //     SubMenu: [new NoteMenu({
  //       Router: "angular/环境设置的坑1",
  //       Title: "环境设置的坑1",
  //       Folder: "notes/angular/环境设置的坑",
  //       SubMenu: [new NoteMenu({
  //         Router: "angular/环境设置的坑12",
  //         Title: "使用核显推理LLM",
  //         Folder: "/notes/angular/环境设置的坑",
  //         SubMenu: [],
  //         NoteFiles: [
  //           new MarkdownNoteFile({
  //             FileName: "ipex-llm.md",
  //             FilePath: "/notes/AI/使用核显推理LLM/"
  //           })
  //         ]
  //       })],
  //       NoteFiles: [
  //         new MarkdownNoteFile({
  //           FileName: "Angular Introduction2",
  //           FilePath: "notes/angular/Angular Introduction2.md"
  //         })
  //       ]
  //     })], 
  //     NoteFiles: [new MarkdownNoteFile({
  //       FileName: "Angular Introduction1",
  //       FilePath: "notes/angular/Angular Introduction3.md"
  //     })]
  //   }),
  //   new NoteMenu({
  //     Router: "angular2",
  //     Title: "Angular",
  //     Folder: "notes/angular",
  //     SubMenu: [new NoteMenu({
  //       Router: "angular/环境设置的坑21",
  //       Title: "环境设置的坑21",
  //       Folder: "notes/angular/环境设置的坑",
  //       SubMenu: [new NoteMenu({
  //         Router: "angular/环境设置的坑22",
  //         Title: "环境设置的坑22",
  //         Folder: "notes/angular/环境设置的坑",
  //         SubMenu: [],
  //         NoteFiles: [
  //           new MarkdownNoteFile({
  //             FileName: "Angular Introduction3",
  //             FilePath: "notes/angular/Angular Introduction4.md"
  //           })
  //         ]
  //       })],
  //       NoteFiles: [
  //         new MarkdownNoteFile({
  //           FileName: "Angular Introduction2",
  //           FilePath: "notes/angular/Angular Introduction5.md"
  //         })
  //       ]
  //     })], 
  //     NoteFiles: [new MarkdownNoteFile({
  //       FileName: "Angular Introduction1",
  //       FilePath: "notes/angular/Angular Introduction6.md"
  //     })]
  //   })
  // ];
}
