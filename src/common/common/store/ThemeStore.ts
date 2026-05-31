import { action, observable } from "mobx"
import { CardTheme, CARD_THEME_DEFAULT } from "../model"

export const ThemeStore$type = Symbol("ThemeStore")

export interface ThemeStore {
  cardTheme: CardTheme
  setTheme(theme: CardTheme): void
}

export const themeStore = observable<ThemeStore>({
  cardTheme: CARD_THEME_DEFAULT,
  setTheme: action(function setTheme(this: ThemeStore, theme: CardTheme) {
    this.cardTheme = theme
  }),
})
