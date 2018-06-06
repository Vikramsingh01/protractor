
export class PTData{
    getCRTransferRequestData(){
        let objs: any[] = [];
        let obj: any; 
        obj.courtReportTransferRequestId = 1;
        obj.courtReportTransferFromOfficer = "off"
        obj.courtReportTransferFromProviderId = "1"
        obj.courtReportTransferFromTeam = "team"
        obj.courtReportTransferReasonId = 1;
        obj.courtReportTransferStatusId = 1;
        obj.courtReportTransferToOfficer = "offt"
        obj.courtReportTransferToProviderId = 1;
        obj.courtReportTransferToTeam = "TEAM"
        obj.courtReportTransferWithdrawnReasonId = 2;
        obj.spgTransferId = 1;
        obj.spgUpdateUser = "spg";
        obj.spgVersion = "123";
        obj.transferRequestId = 1;
        objs.push(obj);
        objs.push(obj);
    }
}