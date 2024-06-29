import {Injectable} from '@angular/core';

export class LocalStorageService {
  public static getFromLocalStorage(key: string, objType: any): any {
    const storageItem: string | null = localStorage.getItem(key);
    if (storageItem !== null) {
      return JSON.parse(storageItem) as typeof objType;
    } else {
      return undefined as typeof objType;
    }
  }
}
