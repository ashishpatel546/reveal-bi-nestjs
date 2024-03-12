export interface StatusCodeMessages {
    200: 'Report is Available';
    404: 'Report is being generated, Please Wait';
    403: 'Report expired';
  }

export class ReportExporterResponse {
  message: string;

  status_codes: StatusCodeMessages;

  url: string;
}
