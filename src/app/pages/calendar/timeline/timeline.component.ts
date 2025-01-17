import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class TimelineComponent {
  protected weekDays: number[] = Array.from({ length: 7 }, (_, i) => i);
  protected hours: string[] = Array.from({ length: 24 }, (_, i) => `${(i + 1) % 12 || 1} ${i < 12 ? 'AM' : 'PM'}`);
}
