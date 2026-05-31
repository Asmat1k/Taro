import "./TarotCardComponent.scss"
import { useCallback, useState } from "react"
import { observer } from "mobx-react-lite"
import { useTranslation } from "react-i18next"
import { type CardMessage, themeStore } from "@common"

type Props = {
  card: CardMessage
}

export const TarotCardComponent = observer(function TarotCardComponent({ card }: Props) {
  const { t } = useTranslation()
  const [ flipped, setFlipped ] = useState(false)
  const [ imgError, setImgError ] = useState(false)
  const theme = themeStore.cardTheme

  const arcanaLabel =
    card.arcana === "major"
      ? t("chat.panel.cardArcana.major")
      : t("chat.panel.cardArcana.minor")

  const imageUrl = `/cards/${card.cardId}/image?uiTheme=${theme}`

  const onFlip = useCallback(() => {
    setFlipped((prev) => !prev)
  }, [])

  const onImgError = useCallback(() => {
    setImgError(true)
  }, [])

  return (
    <div
      className={`tarot-card${flipped ? " tarot-card--flipped" : ""}`}
      onClick={onFlip}
      title={t("chat.panel.cardHint")}
    >
      <div className="tarot-card__inner">
        <div className={`tarot-card__face tarot-card__front${card.reversed ? " tarot-card__front--reversed" : ""}`}>
          {imgError ? (
            <div className="tarot-card__front-placeholder">
              <span className="tarot-card__front-icon">🃏</span>
              <span className="tarot-card__front-name">{card.title}</span>
            </div>
          ) : (
            <img
              className="tarot-card__front-image"
              src={imageUrl}
              alt={card.title}
              onError={onImgError}
              loading="lazy"
            />
          )}
        </div>

        <div className="tarot-card__face tarot-card__back">
          <div className="tarot-card__back-title">{card.title}</div>
          <div className="tarot-card__back-arcana">{arcanaLabel}</div>
          {String(card.reversed) === "true" && (
            <div className="tarot-card__back-reversed">
              {t("chat.panel.reversed")}
            </div>
          )}
          <div className="tarot-card__back-divider" />
          <div className="tarot-card__back-meaning">{card.meaning}</div>
        </div>
      </div>
    </div>
  )
})
