import { CloseOutlined } from "@ant-design/icons";
import { Button, message, Spin, Upload, UploadFile } from "antd";
import CustomModal from "../../../../components/CustomModal/CustomModal";
import Del from "../../../../shared/images/Del.svg";
import documentIcon from "../../../../shared/images/documentIcon.svg";
import Eye from "../../../../shared/images/Eye.svg";
import { File } from "../../../../shared/types/cases";
import useDocumentController from "./documents.controller";

import "./documents.scss";

export const Documents = () => {
  const {
    fileList,
    bytesToMB,
    deleteLocaly,
    isFiles,
    setIsClearLocally,
    isClearLocally,
    renderClearModal,
    uploadFunc,
    files,
    contextHolder,
    setOpenDeleteModal,
    openDeleteModal,
    renderDeleteModal,
    loader,
    openFile,
    setFileList,
  } = useDocumentController();

  const props = {
    beforeUpload: (file: UploadFile) => {
      const maxSize = 5242880;

      console.log("file", file);

      const isAllowed =
        file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.name.split(".").pop() === "heic" ||
        file.name.split(".").pop() === "HEIC" ||
        file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

      const isValisSize = file.size && file.size < maxSize;

      if (!isValisSize) {
        message.error(`File ${file.name} must not exceed 5 MB`);
      }

      if (!isAllowed) {
        message.error(
          `File ${file.name} extension is not allowed. Please upload file having these extensions: docx, pdf, doc, png, jpg, heic `
        );
      }
      return (isAllowed && isValisSize) || Upload.LIST_IGNORE;
    },
    onChange: (info: { fileList: UploadFile[] }) => {
      setFileList(info.fileList);
    },

    multiple: true,
    showUploadList: false,
  };

  return (
    <>
      <Spin spinning={loader}>
        {contextHolder}
        {isFiles && (
          <div className="documents__btn-row d-flex-end">
            <Upload {...props}>
              <Button className="primary_round_btn">Select Files</Button>
            </Upload>
          </div>
        )}
        <div className="documents">
          {isFiles ? (
            <>
              {fileList.map((file, index) => {
                return (
                  <div className="documents__item">
                    <div>
                      <div className="documents__name">{file.name}</div>
                      <div className="documents__size">{bytesToMB(file.size ? file.size : 0)}</div>
                    </div>
                    <CloseOutlined
                      style={{ cursor: "pointer", padding: "0 20px" }}
                      onClick={() => deleteLocaly(index)}
                    />
                  </div>
                );
              })}
              {files.map((file: File) => {
                return (
                  <div className="documents__item">
                    <div>
                      <div className="documents__name">{file.file_name}</div>
                      <div className="documents__size">
                        {bytesToMB(file.file_size ? file.file_size : 0)}
                      </div>
                    </div>
                    <div className="row" style={{ minWidth: "70px", margin: "0 0 0 20px" }}>
                      <img
                        src={Eye}
                        style={{ cursor: "pointer" }}
                        onClick={() => openFile(file.link)}
                      />
                      <img
                        src={Del}
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDeleteModal(file.id);
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div className="offences__wrapper">
              <img src={documentIcon} />

              <div className="offences__title">Nothing in Documents</div>
              <div className="offences__subtitle">You haven't any documents uploaded</div>

              <Upload {...props}>
                <Button className="primary_round_btn">Upload Files</Button>
              </Upload>
            </div>
          )}
        </div>
        {isFiles && (
          <div className="d-flex-end" style={{ margin: "35px 0" }}>
            <Button
              className="secondary_round_btn"
              onClick={() => setIsClearLocally(true)}
              disabled={fileList.length > 0 ? false : true}
            >
              Clear
            </Button>
            <Button
              className="primary_round_btn"
              style={{ margin: "0 0 0 15px" }}
              onClick={uploadFunc}
              disabled={fileList.length > 0 ? false : true}
            >
              Upload
            </Button>
          </div>
        )}
        <CustomModal
          title="Clear"
          subtitle="Are you sure you want to clear all documents?"
          content={renderClearModal()}
          open={isClearLocally}
          onClose={() => setIsClearLocally(false)}
        />
        <CustomModal
          title="Delete"
          subtitle="Are you sure you want to delete the file?"
          content={renderDeleteModal()}
          open={!!openDeleteModal}
          onClose={() => setOpenDeleteModal(null)}
        />
      </Spin>
    </>
  );
};
