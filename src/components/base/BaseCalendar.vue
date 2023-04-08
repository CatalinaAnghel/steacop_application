<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
            Today
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="createEvent">
            <v-icon medium>
              mdi-calendar-plus-outline
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ getCalendarInstance().title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                <span>{{ title }}</span>
                <v-icon right>
                  mdi-menu-down
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="486">
        <v-calendar ref="calendar" v-model="focus" color="primary" :events="events" :event-color="getEventColor"
          :type="type" @click:event="showEvent" @click:more="viewDay" @click:date="viewDay"
          @change="updateRange"></v-calendar>
        <v-menu v-model="selectedEventOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>
          <slot name="eventCard" :selectedEvent="selectedEvent"></slot>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent } from "vue"
import Vue from 'vue';
import { CalendarRangeInterface, CalendarInterface, EventInterface, CalendarFormatInterface } from "@/modules/calendar";

export default defineComponent({
  emits: ['update:calendar', 'selected:event', 'open:event', 'create:event'],
  props: {
    events: {
      type: Array as () => EventInterface[],
      required: true,
    },
    names: {
      type: Array as () => string[],
      required: true
    },
    colors: {
      type: Array as () => string[],
      required: true
    },
    selectedOpen: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: () => ({
    focus: '',
    type: 'month',
    typeToLabel: {
      month: 'Month',
      day: 'Day'
    } as CalendarFormatInterface,
    selectedEvent: {} as EventInterface,
    selectedElement: null,
  }),
  mounted() {
    this.getCalendarInstance().checkChange();
  },
  computed: {
    title: function (): string {
      return this.typeToLabel[this.type as keyof CalendarFormatInterface];
    },
    selectedEventOpen: {
      get(): boolean {
        return this.selectedOpen;
      },
      set(value: boolean): void {
        this.$emit('selected:event', value);
      }
    }
  },
  methods: {
    viewDay({ date }: any): void {
      this.focus = date
      this.type = 'day'
    },
    getEventColor(event: EventInterface): string {
      return event.color
    },
    setToday(): void {
      this.focus = ''
    },
    prev(): void {
      this.getCalendarInstance().prev();
    },
    next(): void {
      this.getCalendarInstance().next();
    },
    showEvent({ nativeEvent, event }: any): void {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        requestAnimationFrame(() => requestAnimationFrame(() => this.selectedEventOpen = true))
      }

      if (this.selectedOpen) {
        this.selectedEventOpen = false
        requestAnimationFrame(() => requestAnimationFrame(() => open()))
      } else {
        open()
      }
      this.$emit('open:event', this.selectedEvent);

      nativeEvent.stopPropagation()
    },
    updateRange({ start, end }: CalendarRangeInterface): void {
      let endDate = new Date(end.date);
      endDate.setDate(endDate.getDate() + 1);
      let endDay = {
        date: endDate.toISOString().split('T')[0],
        day: endDate.getDay(),
        month: endDate.getMonth(),
        year: endDate.getFullYear()
      }
      
      this.$emit('update:calendar', { start, end: endDay });
    },
    rnd(a: number, b: number): number {
      return Math.floor((b - a + 1) * Math.random()) + a
    },
    getCalendarInstance(): Vue & CalendarInterface {
      return this.$refs.calendar as Vue & CalendarInterface;
    },
    createEvent(): void{
      this.$emit('create:event');
    }
  },
});
</script>