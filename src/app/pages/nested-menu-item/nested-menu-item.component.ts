import { Component, inject, input, Input } from '@angular/core';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NoteMenu, NoteService } from '../../services/note.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTSType } from 'ng-zorro-antd/core/types';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nested-menu-item',
  imports: [NzMenuModule, RouterLink, NzIconModule, NzToolTipModule, CommonModule],
  templateUrl: './nested-menu-item.component.html',
  styleUrl: './nested-menu-item.component.less'
})
export class NestedMenuItemComponent {
  @Input() currentMenu?: NoteMenu
  @Input() autoOpenSelected: boolean = false
  @Input() showToolTip: boolean = false
  noteService = inject(NoteService)
}
