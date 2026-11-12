import { Component } from 'react';
import type { ContextType, ReactNode } from 'react';
import { I18nContext } from '../i18n/core';

type State = { failed: boolean };

/** Shows a translated recovery screen instead of a blank page if a component crashes. */
export default class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  static contextType = I18nContext;
  declare context: ContextType<typeof I18nContext>;
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    const { t } = this.context;
    return (
      <div role="alert" className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-white p-8 text-center">
        <h1 className="text-xl font-bold text-slate-900">{t('error.title')}</h1>
        <p className="mt-2 text-slate-600">{t('error.text')}</p>
        <button type="button" className="mt-6 rounded-xl bg-blue-700 px-5 py-2.5 font-semibold text-white" onClick={() => window.location.reload()}>
          {t('error.reload')}
        </button>
      </div>
    );
  }
}
