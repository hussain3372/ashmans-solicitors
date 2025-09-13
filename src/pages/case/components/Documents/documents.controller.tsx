import { Button, message, UploadFile } from "antd";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { deleteFile, uploadDocument } from "../../../../crud/cases";
import { getCases } from "../../../../crud/dashboard";
import { CaseDetails, CasesReq } from "../../../../shared/types/dashboard";

export default function useDocumentController() {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isClearLocally, setIsClearLocally] = useState(false);
  const [serchParams] = useSearchParams();
  const caseId = serchParams.get("caseId");
  const [files, setFiles] = useState<[]>([]);
  const isFiles = fileList.length > 0 || files.length > 0;
  const [messageApi, contextHolder] = message.useMessage();
  const [openDeleteModal, setOpenDeleteModal] = useState<number | null>(null);
  const [loader, setLoader] = useState(false);

  const fetchCases = () => {
    const data: CasesReq = {
      withValues: false,
      search: "",
    };
    setLoader(true);
    getCases(data)
      .then((res) => {
        if (!caseId) return;
        const elementCase = res.data.cases.find((elem: CaseDetails) => elem.id === +caseId);
        if (elementCase) {
          setFiles(elementCase?.files);
        }
      })
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const uploadFunc = () => {
    setLoader(true);
    const copy = fileList.map((elem, index) => ({ ...elem, id: index }));
    Promise.allSettled(
      copy.map((file) => {
        if (!caseId || !file.originFileObj) return;

        const contentFile = file.originFileObj;
        const formData = new FormData();

        formData.append("file", contentFile, file.name);

        return uploadDocument(+caseId, formData).then(() => {
          const index = copy.findIndex((elem) => elem.id === file.id);
          copy.splice(index, 1);
        });
      })
    )
      .then((results) => {
        const hasErrors = results.some((result) => result.status === "rejected");

        if (hasErrors) {
          messageApi.error("Not all files were uploaded successfully.");
        }

        fetchCases();
      })
      .catch((error) => {
        console.log("error", error);
      })
      .finally(() => {
        setFileList(copy);
        setLoader(false);
      });
  };

  const deleteLocaly = (index: number) => {
    const copy = structuredClone(fileList);
    copy.splice(index, 1);
    setFileList(copy);
  };

  function bytesToMB(bytes: number) {
    if (bytes === 0) return "0 MB";
    const mb = (bytes / 1024 / 1024).toFixed(2);
    return `${mb} MB`;
  }

  const deleteFileFunc = () => {
    if (!openDeleteModal || !caseId) return;
    deleteFile(+caseId, openDeleteModal).then(() => {
      messageApi.success("The file has been successfully deleted");
      setOpenDeleteModal(null);
      fetchCases();
    });
  };

  const renderClearModal = () => {
    return (
      <div className="d-flex-end mt-35" style={{ margin: "0 0 0 0" }}>
        <Button className="secondary_round_btn" onClick={() => setIsClearLocally(false)}>
          Cancel
        </Button>
        <Button
          className="primary_round_btn"
          style={{ margin: "0 0 0 15px" }}
          onClick={() => {
            setFileList([]);
            setIsClearLocally(false);
          }}
        >
          Clear
        </Button>
      </div>
    );
  };

  const renderDeleteModal = () => {
    return (
      <div className="d-flex-end mt-35">
        <Button className="secondary_round_btn" onClick={() => setOpenDeleteModal(null)}>
          Cancel
        </Button>
        <Button className="red_round_btn" style={{ margin: "0 0 0 15px" }} onClick={deleteFileFunc}>
          Delete
        </Button>
      </div>
    );
  };

  const openFile = (link: string) => {
    window.open(link, "_blank");
  };

  return {
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
  };
}
