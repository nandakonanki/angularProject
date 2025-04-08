import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountCreationPayload } from '../../interfaces/account-creation.interface';
import { HeaderComponent } from '../header/header.component';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { ApiService } from '../../services/api.service';
import { finalize } from 'rxjs/operators';

interface Step {
  title: string;
  subtitle: string;
  key: string;
  completed: boolean;
  active: boolean;
}

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent
  ],
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit {
  accountForm!: FormGroup;
  isLoading = false;
  currentStep = 0;
  private accountService = inject(AccountService);
  private apiService = inject(ApiService);

  steps: Step[] = [
    { 
      title: 'Personal',
      subtitle: 'Information',
      key: 'personal',
      completed: false,
      active: true
    },
    { 
      title: 'Contact',
      subtitle: 'Details',
      key: 'contact',
      completed: false,
      active: false
    },
    { 
      title: 'Identity',
      subtitle: 'Verification',
      key: 'identity',
      completed: false,
      active: false
    },
    { 
      title: 'Select Account',
      subtitle: 'Type',
      key: 'accountType',
      completed: false,
      active: false
    },
    { 
      title: 'Review &',
      subtitle: 'Submit',
      key: 'review',
      completed: false,
      active: false
    }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.initializeForm();
    console.log('AccountService injected:', this.accountService); // Debug log
  }

  private initializeForm(): void {
    this.accountForm = this.fb.group({
      individualDetails: this.fb.group({
        alternativeId: ['154821'],
        contactData: this.fb.group({
          emailAddress1: ['', [Validators.required, Validators.email]],
          mobileNumber: ['', Validators.required],
          phoneNumber: ['']
        }),
        countriesOfCitizenship: [['US'], Validators.required],
        dob: ['', Validators.required],
        legalName: this.fb.group({
          firstName: ['', Validators.required],
          lastName: ['', Validators.required],
          middleName: ['']
        }),
        parentClientId: ['1000195150'],
        preferredName: [''],
        primaryAddress: this.fb.group({
          addressLine1: [''],
          addressLine2: [''],
          addressLine3: [''],
          buildingName: [''],
          buildingNumber: [''],
          countryCode: ['US'],
          countrySubDivision: ['', Validators.required],
          districtName: [''],
          floor: [''],
          postCode: ['', Validators.required],
          room: [''],
          streetName: ['', Validators.required],
          townLocationName: [''],
          townName: ['', Validators.required]
        })
      }),
      productCode: ['COREBANKING'],
      taxId: ['', [Validators.required, Validators.pattern(/^\d{3}-\d{2}-\d{4}$/)]],
      taxIdType: ['S'],
      ucmIpid: [''],
      ucmPartyId: [''],
      zelleProfileId: [''],
      kycDocumentDetails: this.fb.group({
        govtIssueAuth: ['', Validators.required],
        govtIssueCountry: ['US'],
        govtIssueIdNum: ['', Validators.required],
        isDocumentary: [false],
        otherSourceDesc: [''],
        sourceOfMethodUtilized: ['DL', Validators.required]
      }),
      virtualAccountDetails: this.fb.group({
        accountType: ['SVG'],
        allowedPaymentMethods: [['Wire', 'Check', 'DebitCard']],
        country: ['US'],
        currency: ['USD'],
        earlyWithdrawalPenalty: [2.5],
        interestRate: [4.5],
        isIndicator: ['Y'],
        minimumBalance: [250],
        overDraftAllowed: [false],
        overDraftLimit: [1200],
        ownerShipRNC: ['SGL'],
        parentAccountNumber: [''],
        virtualAccountName: ['', Validators.required],
        virtualAccountReference: this.fb.array([
          this.fb.group({
            accountReferenceType: ['Checkbook'],
            accountReferenceValue: ['Y']
          }),
          this.fb.group({
            accountReferenceType: ['DebitCard'],
            accountReferenceValue: ['Y']
          }),
          this.fb.group({
            accountReferenceType: ['InitialDepositAmount'],
            accountReferenceValue: ['200']
          })
        ])
      })
    });
  }

  ngOnInit(): void {}

  isStepValid(): boolean {
    const currentStepKey = this.steps[this.currentStep].key;
    const personalDetails = this.accountForm.get('individualDetails');
    const legalName = personalDetails?.get('legalName');
    
    switch (currentStepKey) {
      case 'personal':
        return !!(legalName?.valid && personalDetails?.get('dob')?.valid);
      case 'contact':
        return !!(personalDetails?.get('contactData')?.valid && 
                 personalDetails?.get('primaryAddress')?.valid);
      case 'identity':
        return !!(this.accountForm.get('taxId')?.valid && 
                 this.accountForm.get('kycDocumentDetails')?.valid);
      case 'accountType':
        return !!this.accountForm.get('virtualAccountDetails.virtualAccountName')?.valid;
      case 'review':
        return this.accountForm.valid;
      default:
        return false;
    }
  }

  nextStep(): void {
    if (this.isStepValid()) {
      this.steps[this.currentStep].completed = true;
      this.steps[this.currentStep].active = false;
      this.currentStep++;
      if (this.currentStep < this.steps.length) {
        this.steps[this.currentStep].active = true;
      }
    } else {
      this.markFormGroupTouched(this.accountForm);
    }
  }

  previousStep(): void {
    if (this.currentStep > 0) {
      this.steps[this.currentStep].active = false;
      this.steps[this.currentStep].completed = false;
      this.currentStep--;
      this.steps[this.currentStep].active = true;
      this.steps[this.currentStep].completed = false;
    }
  }

  onSubmit(): void {
    if (this.accountForm.valid && this.currentStep === this.steps.length - 1) {
      try {
        this.isLoading = true;
        
        // Set hardcoded values in the form
        this.accountForm.patchValue({
          individualDetails: {
            alternativeId: '154821',
            parentClientId: '1000195150'
          }
        });

        const formValue = this.accountForm.value;
        
        // Log the complete payload
        console.log('Account Creation Payload:', {
          individualDetails: {
            alternativeId: formValue.individualDetails.alternativeId,
            contactData: formValue.individualDetails.contactData,
            countriesOfCitizenship: formValue.individualDetails.countriesOfCitizenship,
            dob: formValue.individualDetails.dob,
            legalName: formValue.individualDetails.legalName,
            parentClientId: formValue.individualDetails.parentClientId,
            preferredName: formValue.individualDetails.preferredName,
            primaryAddress: formValue.individualDetails.primaryAddress
          },
          productCode: formValue.productCode,
          taxId: formValue.taxId,
          taxIdType: formValue.taxIdType,
          ucmIpid: formValue.ucmIpid,
          ucmPartyId: formValue.ucmPartyId,
          zelleProfileId: formValue.zelleProfileId,
          kycDocumentDetails: formValue.kycDocumentDetails,
          virtualAccountDetails: formValue.virtualAccountDetails
        });
        
        // First call the API
        this.apiService.createUser(formValue)
          .pipe(
            finalize(() => {
              // Regardless of API success/failure, create the account in the local service
              this.createLocalAccount(formValue);
            })
          )
          .subscribe({
            next: (response) => {
              console.log('API Response:', response);
            },
            error: (error) => {
              console.error('API Error:', error);
              // Continue with local account creation even if API fails
            }
          });
      } catch (error) {
        console.error('Error in onSubmit:', error);
        this.isLoading = false;
      }
    } else if (this.currentStep < this.steps.length - 1) {
      // If not on the last step, move to next step
      this.nextStep();
    } else {
      // Mark all form controls as touched to show validation errors
      this.markFormGroupTouched(this.accountForm);
    }
  }

  private createLocalAccount(formValue: any): void {
    // Create account data object with proper type assertion
    const accountData = {
      accountType: formValue.virtualAccountDetails.accountType === 'SVG' ? 'SAV' : 'CHK',
      virtualAccountName: formValue.virtualAccountDetails.virtualAccountName || `${formValue.individualDetails.legalName.firstName}'s ${formValue.virtualAccountDetails.accountType === 'SVG' ? 'Savings' : 'Checking'} Account`
    } as const;

    console.log('Creating local account with data:', accountData);
    
    // Call the account creation method
    this.accountService.createAccount(formValue).subscribe({
      next: () => {
        console.log('Account created successfully');
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error creating account:', error);
        this.isLoading = false;
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  goToStep(stepIndex: number): void {
    if (stepIndex < this.currentStep) {
      // Mark current step as inactive
      this.steps[this.currentStep].active = false;
      
      // Mark all steps after the target step as not completed
      for (let i = stepIndex + 1; i <= this.currentStep; i++) {
        this.steps[i].completed = false;
      }
      
      // Set the target step as active
      this.currentStep = stepIndex;
      this.steps[stepIndex].active = true;
    }
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
