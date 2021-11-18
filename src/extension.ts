import {interval} from 'rxjs';

/**
 * @class Extension
 */
class Extension {
  /**
   * ContentScript constructor
   *
   * @constructor
   */
  constructor() {
    console.info('Prime Enhancer started');
  }

  /**
   * @public
   * @async
   * @returns {Promise<void>}
   */
  public async handleIntro(): Promise<void> {
    const skipButton = await this.getSkipButton();

    if (!skipButton) {
      return;
    }

    // Click
    skipButton.click();
  }

  /**
   * Handle next episode
   *
   * @public
   * @async
   * @returns {Promise<void>}
   */
  public async handleNextEpisode(): Promise<void> {
    const seekBar = await this.getSeekBar();

    if (!seekBar || seekBar.value <= (90).toString()) {
      return;
    }

    const nextEpisode = await this.getNextEpisode();

    //const nextTitle = await this.getNextTitleButton();
    //console.log(!nextEpisode && seekBar.value >= (98).toString() && nextTitle);
    /*
    if (seekBar.value >= (98).toString() && nextTitle) {
        nextTitle.click();
    }
        */
    if (!nextEpisode) {
      return;
    }

    nextEpisode.click();
  }

  /**
   * Handle skip ads
   *
   * @public
   * @async
   * @returns {Promise<void>}
   */
  public async handleSkipAds(): Promise<void> {
    const skipAds = await this.getSkipAds();

    if (!skipAds) {
      return;
    }

    skipAds.click();
  }

  /**
   * Get skip ads "button"
   *
   * @private
   * @async
   * @returns {Promise<HTMLElement>}
   */
  private getSkipAds(): Promise<HTMLElement> {
    return new Promise<HTMLElement>((resolve, reject) => {
      const skipAdsRef = document.getElementsByClassName('fu4rd6c f1cw2swo');

      if (!skipAdsRef || skipAdsRef.length === 0) {
        return;
      }

      const skipAdsElement: HTMLElement = skipAdsRef[0] as HTMLElement;

      resolve(skipAdsElement);
    });
  }

  /**
   * Get intro skip button
   *
   * @private
   * @async
   * @returns {Promise<HTMLButtonElement>}
   */
  private getSkipButton(): Promise<HTMLButtonElement> {
    return new Promise<HTMLButtonElement>((resolve, reject) => {
      const skipButtonRef = document.getElementsByClassName(
        'atvwebplayersdk-skipelement-button'
      );

      if (!skipButtonRef || skipButtonRef.length === 0) {
        return;
      }

      const skipButton: HTMLButtonElement =
        skipButtonRef[0] as HTMLButtonElement;

      resolve(skipButton);
    });
  }

  /**
   * Get player seekbar
   *
   * @private
   * @async
   * @returns {Promise<HTMLInputElement>}
   */
  private getSeekBar(): Promise<HTMLInputElement> {
    return new Promise<HTMLInputElement>((resolve, reject) => {
      const seekBarRef = document.getElementsByClassName(
        'atvwebplayersdk-seekbar-range'
      );

      if (!seekBarRef || seekBarRef.length === 0) {
        return;
      }

      const seekBar: HTMLInputElement = seekBarRef[0] as HTMLInputElement;

      resolve(seekBar);
    });
  }

  /**
   * Get next title button
   *
   * @private
   * @async
   * @returns {Promise<HTMLButtonElement>}
   */
  private getNextTitleButton(): Promise<HTMLButtonElement> {
    return new Promise<HTMLButtonElement>((resolve, reject) => {
      const nextTitleRef = document.getElementsByClassName(
        'atvwebplayersdk-nexttitle-button'
      );

      if (!nextTitleRef || nextTitleRef.length === 0) {
        return;
      }

      const nextTitleButton: HTMLButtonElement =
        nextTitleRef[0] as HTMLButtonElement;

      resolve(nextTitleButton);
    });
  }

  /**
   * Get next episode button
   *
   * @private
   * @async
   * @returns {Promise<HTMLButtonElement>}
   */
  private getNextEpisode(): Promise<HTMLButtonElement> {
    return new Promise<HTMLButtonElement>((resolve, reject) => {
      const nextEpisodeRef = document.getElementsByClassName(
        'atvwebplayersdk-nextupcard-button'
      );

      if (!nextEpisodeRef || nextEpisodeRef.length === 0) {
        return;
      }

      const nextEpisodeButton: HTMLButtonElement =
        nextEpisodeRef[0] as HTMLButtonElement;
      resolve(nextEpisodeButton);
    });
  }
}

const extension = new Extension();

// Mhm, should we let it run
// or should we unsubscribe?
// @todo add next video detection to stop timer
interval(850).subscribe(() => {
  extension.handleIntro();
  extension.handleNextEpisode();
  extension.handleSkipAds();
});
