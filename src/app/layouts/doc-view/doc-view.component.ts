import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GeneralService } from 'src/app/services/general/general.service';
import { IImpressionEventInput, IInteractEventInput } from 'src/app/services/telemetry/telemetry-interface';
import { TelemetryService } from 'src/app/services/telemetry/telemetry.service';
import { ToastMessageService } from 'src/app/services/toast-message/toast-message.service';
import { AuthConfigService } from 'src/app/authentication/auth-config.service';
import { CredentialService } from 'src/app/services/credential/credential.service';

@Component({
    selector: 'app-doc-view',
    templateUrl: './doc-view.component.html',
    styleUrls: ['./doc-view.component.scss']
})
export class DocViewComponent implements OnInit {
    baseUrl: string;
    docUrl: string;
    extension;
    document = [];
    loader: boolean = true;
    docName: any;
    credential: any;
    schemaId: string;
    templateId: string;
    blob: Blob;
    canShareFile = !!navigator.share;
    credentialId: string;

    constructor(
        public generalService: GeneralService,
        private router: Router,
        private http: HttpClient,
        private location: Location,
        private authService: AuthService,
        private activatedRoute: ActivatedRoute,
        private telemetryService: TelemetryService,
        private readonly toastMessage: ToastMessageService,
        private readonly authConfigService: AuthConfigService,
        private readonly credentialService: CredentialService
    ) {
        this.baseUrl = this.authConfigService.config.bffUrl;
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            if (params.credentialId) {
                this.credentialId = params.credentialId;
                this.getCredential().subscribe((result: any) => {
                    this.getPDF(this.credentialId, this.templateId);
                });
            }
        });
    }

    getCredential() {
        return this.credentialService.getCredentialById(this.credentialId)
            .pipe(map((res) => {
                this.credential = res;
                return res;
            }), switchMap((cred: any) => {
                return this.getTemplate(cred.credentialSchemaId).pipe(map((template: any) => {
                    this.templateId = template?.templateId;
                    return { credential: cred, template };
                }));
            }));
    }

    getTemplate(schemaId: string): Observable<any> {
        return this.credentialService.getTemplates(schemaId).pipe(map((templates: any) => {
                if (templates.length > 1) {
                    const selectedLangKey = localStorage.getItem('setLanguage');
                    const certExpireTime = new Date(this.credential.expirationDate).getTime();
                    const currentDateTime = new Date().getTime();
                    const isExpired = certExpireTime < currentDateTime;

                    const type = isExpired ? `inactive-${selectedLangKey}` : `active-${selectedLangKey}`;
                    const template = templates.find((item: any) => item.type === type);

                    if (template) {
                        return template;
                    } else {
                        const genericTemplate = templates.find((item: any) => item.type.toLowerCase() === 'handlebar');
                        if (genericTemplate) {
                            return genericTemplate;
                        } else {
                            return templates[0];
                        }
                    }
                } else if (templates.length === 1) {
                    return templates[0];
                }
                throwError('Template not attached to schema');
            })
        )
    }

    getPDF(credentialId: string, templateId: string) {
        let headerOptions = new HttpHeaders({
            'Accept': 'application/pdf'
        });
        let requestOptions = { headers: headerOptions, responseType: 'blob' as 'json' };
        const request = {
            credentialid: credentialId,
            templateid: templateId,
        }
        this.http.post(`${this.baseUrl}/v1/credentials/render`, request, requestOptions).pipe(map((data: any) => {
            this.blob = new Blob([data], {
                type: 'application/pdf' // must match the Accept type
            });
            this.docUrl = window.URL.createObjectURL(this.blob);
        })).subscribe((result: any) => {
            this.loader = false;
            this.extension = 'pdf';
        });
    }

    goBack() {
        this.location.back();
    }

    downloadCertificate(asJSON?: boolean) {
        let link: any;
        if (asJSON) {
            const blob = new Blob([JSON.stringify(this.credential)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            link = document.createElement("a");
            link.href = url;
            link.download = `${this.authService.currentUser?.name}_certificate.json`.replace(/\s+/g, '_');;
        } else {
            link = document.createElement("a");
            link.href = this.docUrl;
            link.download = `${this.authService.currentUser?.name}_certificate.pdf`.replace(/\s+/g, '_');;
        }
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.raiseInteractEvent('download-certificate');
    }

    shareFile() {
        const pdf = new File([this.blob], "certificate.pdf", { type: "application/pdf" });
        const shareData = {
            title: "Certificate",
            text: `${this.authService.currentUser.name}-${this.credential.credential_schema.name}`,
            files: [pdf]
        };

        if (navigator.share) {
            navigator.share(shareData).then((res: any) => {
            }).catch((error: any) => {
                console.error("Shared operation failed!", error);
            })
        } else {
            this.toastMessage.error("", this.generalService.translateString('SHARED_OPERATION_FAILED'));
            console.error("Share not supported");
        }
    }

    ngAfterViewInit(): void {
        this.raiseImpressionEvent();
    }


    raiseImpressionEvent() {
        const telemetryImpression: IImpressionEventInput = {
            context: {
                env: this.activatedRoute.snapshot?.data?.telemetry?.env,
                cdata: [{
                    id: this.schemaId,
                    type: 'schema'
                }]
            },
            object: {
                id: this.templateId,
                type: 'template'
            },
            edata: {
                type: this.activatedRoute.snapshot?.data?.telemetry?.type,
                pageid: this.activatedRoute.snapshot?.data?.telemetry?.pageid,
                uri: this.router.url,
                subtype: this.activatedRoute.snapshot?.data?.telemetry?.subtype,
            }
        };
        this.telemetryService.impression(telemetryImpression);
    }

    raiseInteractEvent(id: string, type: string = 'CLICK', subtype?: string) {
        const telemetryInteract: IInteractEventInput = {
            context: {
                env: this.activatedRoute.snapshot?.data?.telemetry?.env,
                cdata: [{
                    id: this.schemaId,
                    type: 'schema'
                }]
            },
            object: {
                id: this.templateId,
                type: 'template'
            },
            edata: {
                id,
                type,
                subtype,
                pageid: this.activatedRoute.snapshot?.data?.telemetry?.pageid,
            }
        };
        this.telemetryService.interact(telemetryInteract);
    }
}
