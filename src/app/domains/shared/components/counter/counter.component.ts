import {
  Component,
  //SimpleChanges,
  signal,
  //OnChanges,
  OnInit,
  AfterViewInit,
  OnDestroy,
  input,
  effect,
  computed,
  //linkedSignal,
  //output,
  model,
  afterNextRender,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-counter',
  imports: [CommonModule],
  templateUrl: './counter.component.html',
})
export class CounterComponent implements OnInit, AfterViewInit, OnDestroy {
  $duration = input.required<number>({ alias: 'duration' });
  $message = model.required<string>({ alias: 'message' });
  //$newMessage = linkedSignal(() => this.$message());
  $doubleDuration = computed(() => this.$duration() * 2);
  $counter = signal(0);
  counterRef: number | null = null;
  //changeMessage = output<string>();

  constructor() {
    // NO ASYNC
    // before render
    // una vez
    console.log('constructor');
    console.log('-'.repeat(10));
    effect(() => {
      /* console.log('duration =>', this.duration());
      console.log('message =>', this.message()); */
      this.$duration();
      this.doSomething();
    });
    effect(() => {
      this.$message();
      this.doSomethingTwo();
    });

    afterNextRender(() => {
      this.counterRef = window.setInterval(() => {
        //console.log('run interval');
        this.$counter.update(statePrev => statePrev + 1);
      }, 1000);
    });
  }

  /* ngOnChanges(changes: SimpleChanges) {
    // before and during render
    console.log('ngOnChanges');
    console.log('-'.repeat(10));
    console.log(changes);
    const duration = changes['duration'];
    if (duration && duration.currentValue !== duration.previousValue) {
      this.doSomething();
    }
  } */

  ngOnInit() {
    // after render
    // una vez
    // async, then, subs
    console.log('ngOnInit');
    console.log('-'.repeat(10));
    console.log('duration =>', this.$duration());
    console.log('message =>', this.$message());
  }

  ngAfterViewInit() {
    // after render
    // hijos ya fueron pintandos
    console.log('ngAfterViewInit');
    console.log('-'.repeat(10));
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
    console.log('-'.repeat(10));
    if (this.counterRef) {
      window.clearInterval(this.counterRef);
    }
  }

  doSomething() {
    console.log('change duration');
    // async
  }

  doSomethingTwo() {
    console.log('change message');
    // async
  }

  setMessage() {
    this.$message.set(Math.random().toString());
  }
}
