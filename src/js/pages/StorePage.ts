// @ts-check
import { HttpClient } from '../modules/HttpClient.js';

import * as loc from '../../lang/en/user.js';

interface PostDefinitionsResponse {
  status: number
  request: number
  response: string
}

export class StorePage {
  #wordElement: HTMLInputElement;
  #definitionElement: HTMLTextAreaElement;
  #resultsElement: HTMLParagraphElement;
  #submitElement: HTMLButtonElement;

  #api: string;

  constructor(api: string) {
    this.#wordElement = document.querySelector('.dictionary__input')!;
    this.#definitionElement = document.querySelector('.dictionary__definition')!;
    this.#submitElement = document.querySelector('.dictionary__submit')!;
    this.#resultsElement = document.querySelector('.dictionary__results')!;

    this.#api = api;

    this.#submitElement.onclick = this.#handleSubmit.bind(this);
  }

  async #handleSubmit(e: Event) {
    e.preventDefault();
    this.#clear();

    const [word, definition] = this.#getUserInput();

    if (!Validator.isOnlyAlpha(word) || word === '') {
      return this.#log(loc.INVALID_WORD_INPUT);
    }

    if (!Validator.isOnlyAlpha(definition) || definition === '') {
      return this.#log(loc.INVALID_DEFINITION_INPUT);
    }

    const response = await this.#setDefinition(word, definition) as PostDefinitionsResponse;

    const successMsg = loc.STORE_SUCCESS
      .replace('{1}', response.request.toString())
      .replace('{2}', word);

    const failureMsg = loc.STORE_FAILURE
      .replace('{1}', response.request.toString())
      .replace('{2}', word);

    if (response.status === 200) this.#log(successMsg);
    if (response.status === 400) this.#log(failureMsg);
  }

  async #setDefinition(word: string, definition: string) {
    const _url = new URL(this.#api);

    return HttpClient.post(_url.toString(), { word, definition });
  }

  #getUserInput(): [word: string, definition: string] {
    const word = this.#wordElement.value.trim();
    const definition = this.#definitionElement.value.trim();

    return [word, definition];
  }

  #clear() {
    this.#resultsElement.innerText = '';
  }

  #log(msg: any) {
    this.#resultsElement.innerText = msg;
  }
}

class Validator {
  static isOnlyAlpha(str: string): boolean {
    return /^[a-zA-Z ]+$/.test(str);
  }
}
