import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replacePlaceholder'
})
export class ReplacePlaceholderPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    const val = Object.assign({}, value);
    if (!val?.credential_schema?.schema?.description) {
      return '';
    }
    const placeholderList = val.credential_schema.schema.description.match(/(?<=<).*?(?=>)/g) || [];
    let details = {};
    let description = val.credential_schema.schema.description;
    placeholderList.map((ph: any) => {
      if (val?.credentialSubject?.[ph]) {
        details = { ...details, [ph]: val.credentialSubject[ph] };
      }
    });

    if (Object.keys(details).length) {
      description = val.credential_schema.schema.description.replace(/\<(.*?)\>/g, function (placeholder, capturedText, matchingIndex, inputString) {
        return details[placeholder.substring(1, placeholder.length - 1)];
      });
    }
    return description;
  }
}
