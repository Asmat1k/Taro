import { inject, injectable } from "inversify"
import { runInAction } from "mobx"
import { CardTheme, CARD_THEME_DEFAULT } from "../model"
import { ThemeStore$type, type ThemeStore } from "../store"

const THEME_STORAGE_KEY = "taro_card_theme"

export const ThemeService$type = Symbol("ThemeService")

export interface ThemeService {
  loadAndApplyTheme(): void
  applyTheme(theme: CardTheme): void
}

@injectable()
export class ThemeServiceImpl implements ThemeService {

  loadAndApplyTheme(): void {
    const theme = this.readFromStorage()
    runInAction(() => {
      this.themeStore.setTheme(theme)
    })
  }

  applyTheme(theme: CardTheme): void {
    this.saveToStorage(theme)
    runInAction(() => {
      this.themeStore.setTheme(theme)
    })
  }

  private readFromStorage(): CardTheme {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY)
      if (stored !== null && (Object.values(CardTheme) as string[]).includes(stored)) {
        return stored as CardTheme
      }
    } catch {
      // ignore
    }
    return CARD_THEME_DEFAULT
  }

  private saveToStorage(theme: CardTheme): void {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // ignore
    }
  }

  constructor(
    @inject(ThemeStore$type) private themeStore: ThemeStore,
  ) {
  }
}
