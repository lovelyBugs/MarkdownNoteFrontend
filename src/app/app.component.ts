import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NoteMenu, NoteService } from './services/note.service';
import { NestedMenuItemComponent } from "./pages/nested-menu-item/nested-menu-item.component";
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet, NzIconModule, NzLayoutModule,
    NzBreadCrumbModule, NzDropDownModule, NzToolTipModule, NzMenuModule, NestedMenuItemComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  noteService = inject(NoteService);
  isCollapsed = true;
  isInitCollapsed = true;
  selectedMenus: NoteMenu[] = [];
  ngOnInit() {
    this.isCollapsed = false;
    this.noteService.loadNoteMenu();
  }
  
}
