export const secClauses = [
  { id: '404.a', title: 'Transactions with related persons', text: "Describe any transaction, since the beginning of the registrant's last fiscal year, or any currently proposed transaction, in which the registrant was or is to be a participant and the amount involved exceeds $120,000, and in which any related person had or will have a direct or indirect material interest." },
  { id: '404.a.1', title: 'Required disclosures – name and basis', text: 'The name of the related person and the basis on which the person is a related person.' },
  { id: '404.a.2', title: 'Required disclosures – interest', text: "The related person's interest in the transaction with the registrant, including the related person's position(s) or relationship(s) with, or ownership in, a firm, corporation, or other entity that is a party to, or has an interest in, the transaction." },
  { id: '404.a.3', title: 'Required disclosures – dollar value', text: 'The approximate dollar value of the amount involved in the transaction.' },
  { id: '404.a.4', title: "Required disclosures – related person's share", text: "The approximate dollar value of the amount of the related person's interest in the transaction, which shall be computed without regard to the amount of profit or loss." },
  { id: '404.a.5', title: 'Indebtedness disclosure', text: 'In the case of indebtedness, disclosure shall include the largest aggregate amount of principal outstanding, the amount outstanding as of the latest practicable date, the amount of principal paid, the amount of interest paid, and the rate or amount of interest payable.' },
  { id: '404.b', title: 'Review, approval or ratification', text: "Describe the registrant's policies and procedures for the review, approval, or ratification of any transaction required to be reported under paragraph (a) of this Item." },
  { id: '404.d.1', title: 'Smaller reporting companies – threshold', text: "For smaller reporting companies, disclose transactions exceeding the lesser of $120,000 or one percent of the average of the company's total assets at year end for the last two completed fiscal years." }
]

export const gdprClauses = [
  { id: 'art5.1.a', principle: 'lawfulness, fairness and transparency', text: 'Personal data shall be processed lawfully, fairly and in a transparent manner in relation to the data subject.' },
  { id: 'art5.1.b', principle: 'purpose limitation', text: 'Personal data shall be collected for specified, explicit and legitimate purposes and not further processed in a manner that is incompatible with those purposes.' },
  { id: 'art5.1.c', principle: 'data minimisation', text: 'Personal data shall be adequate, relevant and limited to what is necessary in relation to the purposes for which they are processed.' },
  { id: 'art5.1.d', principle: 'accuracy', text: 'Personal data shall be accurate and, where necessary, kept up to date; every reasonable step must be taken to ensure that personal data that are inaccurate are erased or rectified without delay.' },
  { id: 'art5.1.e', principle: 'storage limitation', text: 'Personal data shall be kept in a form which permits identification of data subjects for no longer than is necessary for the purposes for which the personal data are processed.' },
  { id: 'art5.1.f', principle: 'integrity and confidentiality', text: 'Personal data shall be processed in a manner that ensures appropriate security of the personal data, including protection against unauthorised or unlawful processing and against accidental loss, destruction or damage.' },
  { id: 'art5.2', principle: 'accountability', text: 'The controller shall be responsible for, and be able to demonstrate compliance with, paragraph 1.' }
]

export const regulations = [
  { key: 'sec', label: 'SEC Item 404 — Related Party Transactions', clauses: secClauses },
  { key: 'gdpr', label: 'GDPR Article 5 — Data Principles', clauses: gdprClauses }
]
