import { Breadcrumb, Button, Divider, Form, Segmented, Spin } from "antd";
import { useLocation } from "react-router-dom";
import CustomModal from "../../components/CustomModal/CustomModal";
import { FormItems } from "../../components/FormItems/FormItems";
import { RadioListContent } from "../../components/RadioListContent/RadioListContent";
import { FormsTab } from "../../features/Forms/components/FormsTab/FormsTab";
import { LookupIcon } from "../../shared/icons/LookupIcon";
import editIcon from "../../shared/images/Edit.svg";
import Transfer from "../../shared/images/Transfer.svg";
import "../dashboard/dashboard.scss";
import useCaseController from "./Case.controller";
import "./case.scss";
import { Documents } from "./components/Documents/Documents";
import { Offences } from "./components/Offence/Offences";

export const Case = () => {
  const {
    activeTab,
    setActiveTab,
    fields,
    setSlug,
    slug,
    form,
    setIsCreate,
    isCreate,
    ClickOnCreate,
    renderCreateAction,
    contextHolder,
    selectFormOpen,
    setSelectFormOpen,
    renderSelectForm,
    isView,
    isCreateCase,
    isEdit,
    setIsEditModal,
    setIsDiscardModal,
    isDiscardModal,
    ClickOnSave,
    renderEditAction,
    isEditModal,
    renderDiscardAction,
    setOpenDelete,
    openDelete,
    instance,
    renderDeleteAction,
    items,
    renderLookup,
    setOpenLookup,
    openLookup,
    navigate,
    segmentOptions,
    id,
    setIsOpenTransfer,
    setIsCloseTransfer,
    isOpenTransfer,
    renderTransfer,
    element,
    setOpenActions,
    openActions,
    refActions,
    setElement,
    updateStatusFunc,
  } = useCaseController();
  const location = useLocation();
  const path = location.pathname;

  const getFormsTab = () =>
    activeTab === "Forms" && (
      <FormsTab
        selectFormOpen={selectFormOpen}
        setSelectFormOpen={setSelectFormOpen}
        element={element}
        setElement={setElement}
        refActions={refActions}
        instance={instance}
        caseId={id}
      />
    );

  return (
    <div className={(isEdit || isCreateCase) && activeTab === "Case Info" ? "case-create" : "case"}>
      {contextHolder}
      <div className="case__header row">
        <Breadcrumb separator=">" items={items} />
        {isCreateCase && (
          <Button className="small_btn primary_round_btn" onClick={() => setOpenLookup(true)}>
            <LookupIcon />
            Lookup
          </Button>
        )}
      </div>
      {path.includes("view") ? (
        <div className="row case__segment-wrapper">
          <Segmented value={activeTab} onChange={setActiveTab} options={segmentOptions} />
        </div>
      ) : (
        ""
      )}
      {instance === "court_duty" ? (
        <div>
          {activeTab === "Case Info" &&
            (!fields.length ? (
              <div className="case__no-content d-flex-column">
                <Spin size="large"></Spin>
              </div>
            ) : (
              <>
                <div className="case__content">
                  <div className="case__title">General</div>
                  <Form className="form-list" form={form}>
                    <div className="form-list">
                      <FormItems
                        itemsData={[
                          { slug: "office-court" },
                          { slug: "date-duty" },
                          { slug: "court" },
                          { slug: "fee-earner-court" },
                          { slug: "it-swapped" },
                          { slug: "whom" },
                        ]}
                        fields={fields}
                        setSlug={setSlug}
                        itemDisabled={!!isView}
                      />
                    </div>
                  </Form>
                </div>
              </>
            ))}
          {getFormsTab()}
          {activeTab === "Documents" && <Documents />}
        </div>
      ) : (
        <div>
          {activeTab === "Case Info" &&
            (!fields.length ? (
              <div className="case__no-content d-flex-column">
                <Spin size="large"></Spin>
              </div>
            ) : (
              <>
                {activeTab === "Case Info" && element && element?.status !== 9 && (
                  <div className="d-flex-end">
                    <div
                      className="simple_btn_round"
                      onClick={() => navigate(`/case/${instance}/edit?caseId=${id}`)}
                    >
                      <img src={editIcon} width={16} height={16} />
                      Edit Case
                    </div>
                    <div
                      className="simple_btn_round"
                      onClick={() => setIsOpenTransfer(true)}
                      style={{ margin: "0 0 0 15px" }}
                    >
                      <img src={Transfer} width={16} height={16} />
                      Transfer Case
                    </div>
                  </div>
                )}
                <div className="case__content case__content_mt-10">
                  <div className="case__title">General</div>
                  <Form className="form-list" form={form}>
                    <div className="form-list">
                      <FormItems
                        itemsData={[
                          { slug: "title" },
                          { slug: "forename" },
                          { slug: "surname" },
                          { slug: "date-birth" },
                          { slug: "tel-mobile", label: "Mobile number" },
                          { slug: "tel-home", label: "Telephone number" },
                          { slug: "email-address" },
                          { slug: "address", label: "Address" },
                          { slug: "post-code" },
                        ]}
                        fields={fields}
                        setSlug={setSlug}
                        itemDisabled={!!isView}
                      />
                    </div>
                    <div>
                      <div className="form-item-wrapper">
                        <FormItems
                          itemsData={[{ slug: "opt-marketing-email-addresss" }]}
                          fields={fields}
                          setSlug={setSlug}
                          itemDisabled={!!isView}
                        />
                      </div>
                      <div className="form-item-wrapper">
                        <FormItems
                          itemsData={[{ slug: "gender" }]}
                          fields={fields}
                          setSlug={setSlug}
                          itemDisabled={!!isView}
                        />
                      </div>
                    </div>
                  </Form>
                </div>
                <div className="case__content">
                  <div className="case__title">Case Info</div>
                  <Form className="form-list" form={form}>
                    <div className="form-list">
                      <FormItems
                        itemsData={[
                          { slug: "ni-number" },
                          { slug: "ethnicity" },
                          { slug: "disability" },
                          { slug: "date-first-contact" },
                          { slug: "office" },
                          { slug: "fee-earner" },
                          { slug: "police-station" },
                          { slug: "source" },
                          { slug: "funding" },
                        ]}
                        fields={fields}
                        setSlug={setSlug}
                        itemDisabled={!!isView}
                      />
                      <Divider />
                      <FormItems
                        itemsData={[
                          { slug: "case-category", forceNotRequired: true },
                          { slug: "case-status", forceNotRequired: true },
                          { slug: "billing-status", forceNotRequired: true },
                        ]}

                        fields={fields}
                        setSlug={setSlug}
                        itemDisabled={!!isView}
                      />
                    </div>
                  </Form>
                </div>
              </>
            ))}
          {getFormsTab()}
          {activeTab === "Offences" && <Offences showOutcomeInput={false} />}
          {activeTab === "Documents" && <Documents />}
        </div>
      )}

      {activeTab === "Case Info" && (isEdit || isCreateCase) && (
        <>
          {(isEdit || isCreateCase) && (
            <div className="row__btns">
              <Button
                className="red_round_btn m-r"
                onClick={() => setOpenDelete(true)}
                style={isCreateCase ? { visibility: "hidden" } : {}}
              >
                Delete
              </Button>

              <div className="row">
                <Button className="secondary_round_btn m-r" onClick={() => setIsDiscardModal(true)}>
                  Cancel
                </Button>

                {isCreateCase && (
                  <Button className="primary_round_btn" onClick={ClickOnCreate}>
                    Create Case
                  </Button>
                )}
                {isEdit && (
                  <Button className="primary_round_btn" onClick={ClickOnSave}>
                    Save
                  </Button>
                )}
              </div>
            </div>
          )}
        </>
      )}
      {!!slug && (
        <CustomModal
          title={slug
            .split("-")
            .map((item) => item[0]?.toUpperCase() + item.slice(1))
            .join(" ")}
          content={
            <RadioListContent
              fields={fields}
              form={form}
              slug={slug}
              setSlug={setSlug}
              onBlur={updateStatusFunc}
            />
          }
          open={!!slug}
          onClose={() => setSlug("")}
        />
      )}

      <CustomModal
        title={"Select Form"}
        content={renderSelectForm()}
        open={!!selectFormOpen}
        onClose={() => setSelectFormOpen(false)}
        className="select"
      />
      <CustomModal
        title={"Create case"}
        subtitle={"Are you sure you wish to create this new case?"}
        content={renderCreateAction()}
        open={!!isCreate}
        onClose={() => setIsCreate(false)}
      />
      <CustomModal
        title={"Save case"}
        subtitle={"Are you sure you wish to save this case?"}
        content={renderEditAction()}
        open={!!isEditModal}
        onClose={() => setIsEditModal(false)}
      />
      <CustomModal
        title={"Discard this form?"}
        subtitle={"Do you want to discard it?"}
        content={renderDiscardAction()}
        open={!!isDiscardModal}
        onClose={() => setIsDiscardModal(false)}
      />

      <CustomModal
        title={"Delete action"}
        subtitle={"Do you wish to delete case?"}
        content={renderDeleteAction()}
        open={openDelete}
        onClose={() => setOpenDelete(false)}
      />
      {openLookup && (
        <CustomModal
          title={"Lookup"}
          subtitle={""}
          content={renderLookup()}
          open={openLookup}
          onClose={() => setOpenLookup(false)}
          className="lookup"
        />
      )}

      <CustomModal
        title={"Transfer Case"}
        subtitle={""}
        content={renderTransfer()}
        open={isOpenTransfer}
        onClose={setIsCloseTransfer}
        width="350px"
        className="transfer-modal"
      />
    </div>
  );
};
