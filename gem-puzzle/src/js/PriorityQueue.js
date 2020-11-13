// source: https://www.geeksforgeeks.org/implementation-priority-queue-javascript/
import {
  QElement,
} from "./QElement";

export class PriorityQueue {
  // An array is used to implement priority
  constructor() {
    this.items = [];
  }

  // functions to be implemented
  // enqueue(item, priority) ----  adds an element to the queue according to its priority.
  // dequeue()               ----  Removes an element from the priority queue
  // front()                 ----  returns the front element of the Priority queue
  // rear()                  ----  returns the last element of the Priority queue
  // isEmpty()
  // printPQueue()

  enqueue(element, priority) {
    // creating object from queue element
    const qElement = new QElement(element, priority);
    let contain = false;

    // iterating through the entire
    // item array to add element at the
    // correct location of the Queue
    for (let i = 0; i < this.items.length; i += 1) {
      if (this.items[i].priority > qElement.priority) {
        // Once the correct location is found it is
        // enqueued
        this.items.splice(i, 0, qElement);
        contain = true;
        break;
      }
    }

    // if the element have the highest priority
    // it is added at the end of the queue
    if (!contain) {
      this.items.push(qElement);
    }
  }

  dequeue() {
    // return the dequeued element
    // and remove it.
    // if the queue is empty
    // returns Underflow
    if (this.isEmpty()) {
      return "Underflow";
    }
    return this.items.shift();
  }

  front() {
    // returns the highest priority element
    // in the Priority queue without removing it.
    if (this.isEmpty()) {
      return "No elements in Queue";
    }
    return this.items[0];
  }

  rear() {
    // returns the lowest priorty
    // element of the queue
    if (this.isEmpty()) {
      return "No elements in Queue";
    }
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    // return true if the queue is empty.
    return this.items.length === 0;
  }

  printPQueue() {
    const str = "";
    for (let i = 0; i < this.items.length; i += 1) {
      str.concat(this.items[i].element).concat(" ");
    }
    return str;
  }
}

export default PriorityQueue;
