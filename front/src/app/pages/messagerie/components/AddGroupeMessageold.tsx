import { FC, useEffect, useRef, useState } from "react";
import { Step1 } from "./steps/Step1";
import { Step2 } from "./steps/Step2";
import { Step3 } from "./steps/Step3";
import { Step4 } from "./steps/Step4";
import { Step5 } from "./steps/Step5";
import { KTIcon } from "../../../../_metronic/helpers";
import { StepperComponent } from "../../../../_metronic/assets/ts/components";
import { Form, Formik, FormikValues } from "formik";
import {
  createAccountSchemas,
  ICreateAccount,
  inits,
} from "./CreateAccountWizardHelper";
import { Toolbar } from "../../../../_metronic/layout/components/toolbar/Toolbar";
import { Content } from "../../../../_metronic/layout/components/Content";

const AddGroupeMessageOld: FC = () => {
  const stepperRef = useRef<HTMLDivElement | null>(null);
  const [stepper, setStepper] = useState<StepperComponent | null>(null);
  const [currentSchema, setCurrentSchema] = useState(createAccountSchemas[0]);
  const [initValues] = useState<ICreateAccount>(inits);
  const [isSubmitButton, setSubmitButton] = useState(false);

  const loadStepper = () => {
    setStepper(
      StepperComponent.createInsance(stepperRef.current as HTMLDivElement)
    );
  };

  const prevStep = () => {
    if (!stepper) {
      return;
    }

    stepper.goPrev();

    setCurrentSchema(createAccountSchemas[stepper.currentStepIndex - 1]);

    setSubmitButton(stepper.currentStepIndex === stepper.totalStepsNumber);
  };

  const submitStep = async (values: ICreateAccount, actions: FormikValues) => {
    if (!stepper) {
      return;
    }

    if (stepper.currentStepIndex !== stepper.totalStepsNumber) {
      try {
        await currentSchema.validate(values);
        stepper.goNext();
        setCurrentSchema(createAccountSchemas[stepper.currentStepIndex]);
      } catch (error) {
        console.error("Validation failed:", error);
        // Affichez les erreurs à l'utilisateur ici
      }
    } else {
      stepper.goto(1);
      actions.resetForm();
    }

    setSubmitButton(stepper.currentStepIndex === stepper.totalStepsNumber);
  };

  useEffect(() => {
    if (!stepperRef.current) {
      return;
    }

    loadStepper();
  }, [stepperRef]);

  return (
    <>
      {/* <Toolbar /> */}
      <Content>
        <div className="card">
          <div className="card-body">
            <div
              ref={stepperRef}
              className="stepper stepper-links d-flex flex-column pt-15"
              id="kt_create_account_stepper"
            >
              <div className="stepper-nav mb-5">
                <div
                  className="stepper-item current"
                  data-kt-stepper-element="nav"
                >
                  <h3 className="stepper-title">Groupe</h3>
                </div>

                <div className="stepper-item" data-kt-stepper-element="nav">
                  <h3 className="stepper-title">Personnalisé</h3>
                </div>

                <div className="stepper-item" data-kt-stepper-element="nav">
                  <h3 className="stepper-title">Objet</h3>
                </div>

                <div className="stepper-item" data-kt-stepper-element="nav">
                  <h3 className="stepper-title">Nom du Groupe</h3>
                </div>

                <div className="stepper-item" data-kt-stepper-element="nav">
                  <h3 className="stepper-title">Completed</h3>
                </div>
              </div>

              <Formik
                validationSchema={currentSchema}
                initialValues={initValues}
                onSubmit={submitStep}
              >
                {() => (
                  <Form
                    className="mx-auto mw-600px w-100 pt-15 pb-10"
                    id="kt_create_account_form"
                  >
                    <div className="current" data-kt-stepper-element="content">
                      <Step1 />
                    </div>

                    <div data-kt-stepper-element="content">
                      <Step2 />
                    </div>

                    <div data-kt-stepper-element="content">
                      <Step3 />
                    </div>

                    <div data-kt-stepper-element="content">
                      <Step4 />
                    </div>

                    <div data-kt-stepper-element="content">
                      <Step5 />
                    </div>

                    <div className="d-flex flex-stack pt-15">
                      <div className="mr-2">
                        <button
                          onClick={prevStep}
                          type="button"
                          className="btn btn-lg btn-light-primary me-3"
                          data-kt-stepper-action="previous"
                        >
                          <KTIcon iconName="arrow-left" className="fs-4 me-1" />
                          Back
                        </button>
                      </div>

                      <div>
                        <button
                          type="submit"
                          className="btn btn-lg btn-primary me-3"
                        >
                          <span className="indicator-label">
                            {!isSubmitButton && "Continue"}
                            {isSubmitButton && "Submit"}
                            <KTIcon
                              iconName="arrow-right"
                              className="fs-3 ms-2 me-0"
                            />
                          </span>
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </Content>
    </>
  );
};

export { AddGroupeMessageOld };
