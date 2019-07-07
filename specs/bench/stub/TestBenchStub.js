/* @flow */

import sinonLib from 'sinon';
import { TestBenchStubLocalStorage } from './TestBenchStubLocalStorage';
const UuidModule = require('../../../src/lib/functions/uuid');

export class TestBenchStub {
  #sinon;
  #$uuid;
  #$ls;

  constructor() {
    this.#sinon = sinonLib.createSandbox();
  }

  get uuid() {
    if (!this.#$uuid) {
      this.#$uuid = this.#sinon.stub(UuidModule, 'uuid');
    }
    return this.#$uuid;
  }

  uuidCycle(n: number) {
    let i = 1;
    return this.uuid.callsFake(() => {
      if (i > n) i = 1;
      return i++;
    })
  }
  
  get ls() {
    if (!this.#$ls) {
      this.#$ls = new TestBenchStubLocalStorage(this.#sinon);
    }
    return this.#$ls;
  }

  restore() {
    this.#sinon.restore();
  }
}