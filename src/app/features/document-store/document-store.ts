export class DocumentStore {
    entityType: any;
    linkedToId: any;
    documentName: any;
    file: any;
    isReadOnly: any;
    crn: any;
    createdDate:any;
    neoDocumentId: number;
	neoDocumentVersionId: number;
	docType: string;
	reserved: boolean;
	author: string;
	lastModifiedDate: Date;
    fromDate: Date;
    toDate: Date;
	updatedBy: string;
	alfrescoDocId: string;
	documentStatus: string;
}

export class EntityType {
    key: any;
    value: any;
}
