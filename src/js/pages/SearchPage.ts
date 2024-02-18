import { HttpClient } from '../modules/HttpClient.js';

import * as loc from '../../lang/en/user.js';

interface GetDefinitionsResponse {
  status: number
  request: number
  definition: string
}

export class SearchPage {
  #searchElement: HTMLInputElement;
  #submitElement: HTMLButtonElement;
  #resultsElement: HTMLDivElement;

  #api: string;

  constructor(api: string) {
    this.#searchElement = document.querySelector('.dictionary__input')!;
    this.#submitElement = document.querySelector('.dictionary__submit')!;
    this.#resultsElement = document.querySelector('.dictionary__results')!;

    this.#api = api;

    this.#submitElement.onclick = this.#handleSubmit.bind(this);
  }

  async #handleSubmit(e: Event) {
    e.preventDefault();
    this.#clear();

    const [word] = this.#getUserInput();

    if (!Validator.isOnlyAlpha(word) || word === '') {
      return this.#log(loc.INVALID_WORD_INPUT);
    }

    const response = await this.#search(word) as GetDefinitionsResponse;

    const successMsg = loc.SEARCH_SUCCESS
      .replace('{1}', response.request.toString())
      .replace('{2}', word)
      .replace('{3}', response.definition);

    const failureMsg = loc.SEARCH_FAILURE
      .replace('{1}', response.request.toString());

    if (response.status === 200) this.#log(successMsg);
    if (response.status === 400) this.#log(failureMsg);
  }

  async #search(word: string) {
    const _url = new URL(this.#api);
    _url.searchParams.append('word', word);

    return HttpClient.get(_url.toString());
  }

  #getUserInput(): [word: string] {
    const word = this.#searchElement.value.trim();

    return [word];
  }

  #clear() {
    this.#resultsElement.innerText = '';
  }

  #log(message: any) {
    this.#resultsElement.innerText = message;
  }
}

class Validator {
  static isOnlyAlpha(str: string): boolean {
    return /^[a-zA-Z ]+$/.test(str);
  }
}
