import { icons, images } from "@/constants";

interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: string;
  icon: any;
}

export const transactions: Transaction[] = [
  { id: '1', title: 'Netflix', date: 'Apr 15, 11:00 AM', amount: '-$60', icon: icons.netflix },
  { id: '2', title: 'Slack', date: 'Apr 15, 11:00 AM', amount: '-$90', icon: icons.slack },
  { id: '3', title: 'Sintia', date: 'Apr 15, 11:00 AM', amount: '+$250', icon: icons.google },
  { id: '4', title: 'YouTube', date: 'Apr 15, 11:00 AM', amount: '-$80', icon: icons.youtube },
  { id: '5', title: 'Medium', date: 'Apr 15, 10:12 AM', amount: '-$85', icon: icons.medium },
  { id: '6', title: 'Flaticon', date: 'Apr 15, 09:49 AM', amount: '-$80', icon: icons.flaticon },
  { id: '7', title: 'Figma', date: 'Apr 15, 09:00 AM', amount: '+$320', icon: icons.figma2 },
  { id: '8', title: 'Twitter', date: 'Apr 15, 09:00 AM', amount: '-$80', icon: icons.twitter2 },
  { id: '9', title: 'ChatGPT', date: 'Apr 15, 08:54 AM', amount: '+$230', icon: icons.chatgpt },
  { id: '10', title: 'YouTube', date: 'Apr 15, 11:00 AM', amount: '-$80', icon: icons.youtube },
];

export const recipients = [
    { id: '1', name: 'Jhonliquid', account: '3253 4332 45676', avatar: images.user1 },
    { id: '2', name: 'Alexysances', account: '3253 4332 45676', avatar: images.user2 },
    { id: '3', name: 'Rizwan Gustama', account: '2123 3332 2223 1123', avatar: images.user3 },
    { id: '4', name: 'Purwa Adi', account: '3213 1231 4567 8768', avatar: images.user4 },
    { id: '5', name: 'John Brei', account: '3213 1231 1567 8263', avatar: images.user5 },
];

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const faqs: FAQItem[] = [
  {
    id: '1',
    question: 'How do I access monthly financial reports?',
    answer:
      'To access monthly financial reports, go to the spending page, select financial reports, choose the desired month, then download or view.',
  },
  {
    id: '2',
    question: 'Do you need technical assistance related to our financial applications or systems?',
    answer: 'If you encounter technical issues, please contact support via live chat or email for assistance.',
  },
  {
    id: '3',
    question: 'What are the steps to add or delete bank accounts in this application?',
    answer:
      'Navigate to the User tab, select Bank Accounts, then tap Add or Delete next to the account you wish to modify.',
  },
  {
    id: '4',
    question: 'How do I change my account password?',
    answer:
      'Go to Settings > Security > Change Password, then follow the on-screen instructions to update your password.',
  },
  {
    id: '5',
    question: 'How can I update my profile information?',
    answer:
      'Go to the User tab, tap on Profile, then edit your details (name, email, picture) and save your changes.',
  },
  {
    id: '6',
    question: 'Can I schedule recurring transfers?',
    answer:
      'Yes – on the Transfer screen, select Recurring Transfers, choose frequency and dates, then confirm to set it up.',
  },
  {
    id: '7',
    question: 'What should I do if I lose my card?',
    answer:
      'Contact support immediately via live chat or phone to block your card and request a replacement. You can also disable the card in the app under Card Settings.',
  },
  {
    id: '8',
    question: 'How can I change notification settings?',
    answer:
      'Go to Settings > Notifications to toggle email, SMS, or in-app alerts according to your preference.',
  },
];