import { Forms } from "../../features/Forms";
// import useFormPageController from "./FormPage.controller";
import "./formPage.scss";

export const FormPage = () => {
  // const {
  //   slug,
  //   setSlug,
  //   formName,
  //   formId,
  //   sections,
  //   form,
  //   initialValues,
  //   saveFormFunc,
  //   contextHolder,
  //   pathFromViewToEdit,
  //   pathFromEditToView,
  //   pathFromCreateToView,
  //   navigate,
  //   isView,
  //   pathBackToCaseInfo,
  //   isEdit,
  // } = useFormPageController();

  return (
    <div className="form-page">
      {/* {contextHolder}

      <div className="form-page__title ">
        {transformName(formName!)}{" "}
        {isView && (
          <div className="simple_btn" onClick={() => navigate(pathFromViewToEdit)}>
            <img src={editIcon} />
            Edit form
          </div>
        )}
      </div>
      <Form form={form} initialValues={initialValues}>
        <Collapse
          expandIcon={({ isActive }) => <DownOutlined rotate={isActive ? 180 : 0} />}
          expandIconPosition="end"
          items={sections.map(({ id, name, fields }) => {
            const itemsData = getFormItemsData(formId, fields)?.[id];
            return {
              key: id,
              label: transformName(name),
              children: itemsData ? (
                <div className="form-list">
                  <FormItems
                    itemsData={itemsData!}
                    fields={fields}
                    setSlug={setSlug}
                    itemDisabled={isView ? true : "false"}
                  />
                </div>
              ) : formId === "4" && id === 141 ? (
                <Offences withoutBtns />
              ) : (
                <></>
              ),
            };
          })}
        />
      </Form>
      {isView ? (
        <div className="row__btns">
          <div></div>
          <div className="row">
            <div className="d-flex-end mt-35">
              <Button
                className="secondary_round_btn"
                style={{ margin: "0 20px 0 0" }}
                onClick={() => navigate(pathBackToCaseInfo)}
              >
                Back
              </Button>
            </div>
            <div className="d-flex-end">
              <Button className="primary_round_btn">Submit to Proclaim</Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="row__btns">
          <div className="d-flex-end">
            <Button
              className="secondary_round_btn m-r"
              onClick={() => {
                if (isEdit) {
                  navigate(pathFromEditToView);
                } else {
                  navigate(pathFromCreateToView);
                }
              }}
            >
              Cancel
            </Button>
            <Button className="primary_round_btn" onClick={saveFormFunc}>
              Save
            </Button>
          </div>
        </div>
      )}
      <CustomModal
        title=""
        content={
          <RadioListContent
            fields={
              sections.find(({ fields }) => fields.find((field) => field.slug === slug))?.fields
            }
            form={form}
            slug={slug}
            setSlug={setSlug}
          />
        }
        open={!!slug}
        onClose={() => setSlug("")}
      /> */}
      <Forms />
    </div>
  );
};
