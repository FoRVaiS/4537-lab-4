// @ts-check
export type HttpClientOptions = {
  headers: Record<string, string>;
}

export class HttpClient {
  static async use(method: 'GET' | 'POST', url: string, sendArg: any, postOpenCb?: (xhr: XMLHttpRequest) => void) {
    return new Promise(resolve => {
      const xhr = new XMLHttpRequest();

      xhr.open(method, url, true);
      if (postOpenCb) postOpenCb(xhr);
      xhr.send(sendArg);

      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          const json = {
            status: xhr.status,
            ...JSON.parse(xhr.response)
          };

          return resolve(json);
        }
      };
    });
  }

  static async get(url: string, options?: HttpClientOptions) {
    const headers = options?.headers || {};

    return HttpClient.use('GET', url, null, xhr => HttpClient.setHeaders(xhr, headers));
  }

  static async post(url: string, body: Record<string, unknown> = {}, options?: HttpClientOptions) {
    const headers = options?.headers || {};

    return HttpClient.use('POST', url, JSON.stringify(body), xhr => HttpClient.setHeaders(xhr, headers));
  }

  static setHeaders(xhr: XMLHttpRequest, headers: Record<string, string>) {
    Object.entries(headers).forEach(([header, value]) => {
      xhr.setRequestHeader(header, value);
    });
  }
}
