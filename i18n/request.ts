import { getRequestConfig } from 'next-intl/server';
import tr from '../messages/tr.json';
import en from '../messages/en.json';

const messagesMap: Record<string, any> = { tr, en };

export default getRequestConfig(async (params) => {
  const reqLocale = await params.requestLocale;
  const locale = reqLocale || (params as any).locale || 'tr';
  const selectedMessages = messagesMap[locale] || tr;

  return {
    locale,
    messages: selectedMessages
  };
});
