import { Button, Layout, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import CustomModal from "../../components/CustomModal/CustomModal";
import { Header } from "../../components/Header/Header";
import { Navigation } from "../../components/Navigation/Navigation";
import { uploadProfilePicture } from "../../crud/dashboard";
import useLoginFuncController from "../../pages/auth/login/Login.controller";
import { selectMe, setUser, setUserLogo } from "../../redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import "./mainLayout.scss";

export const MainLayout = () => {
  const me = useAppSelector(selectMe);
  const dispatch = useAppDispatch();
  const [openProfile, setOpenProfile] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [cropVisible, setCropVisible] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const { microsoftFunc } = useLoginFuncController();
  const location = useLocation();
  const path = location.pathname;
  const user = useAppSelector((state) => state.auth);

  const getBase64 = (file: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const onChange = () => {
    setIsEdit(true);
    setCropVisible(true);
  };
  const handleCancelProfilePicture = () => {
    setCropVisible(false);
    setIsEdit(false);
  };

  const handleSaveProfilePicture = async () => {
    if (croppedImage) {
      await uploadProfilePicture({ id: me.id, profile_picture: croppedImage });
      setUser({ ...user, profilePicture: croppedImage });
      dispatch(setUserLogo(croppedImage));
    }
    setOpenProfile(false);
    setIsEdit(false);
    setCroppedImage(null);
  };

  const handleCrop = async (file: Blob) => {
    const src = await getBase64(file);
    setCroppedImage(src);
  };

  const renderProfileInfo = () => {
    return (
      <div style={{ justifyContent: "space-between" }} className="d-flex-column main-layout-modal">
        <ImgCrop
          showGrid
          rotationSlider
          aspectSlider
          modalTitle="Change Profile Picture"
          modalClassName="crop-modal"
          cropShape="round"
          open={cropVisible}
          onModalOk={handleCrop}
          modalProps={{
            visible: cropVisible,
            onCancel: handleCancelProfilePicture,
            okButtonProps: {
              className: "primary_round_btn",
            },
            cancelButtonProps: {
              className: "secondary_round_btn m-r",
            },
            rootClassName: "crop-modal",
          }}
        >
          <Upload multiple={false} showUploadList={false} onChange={onChange}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                rowGap: "20px",
                cursor: "pointer",
              }}
            >
              {user.profilePicture && <img width={100} src={user.profilePicture} />}
              <Button className="primary_border_btn main-layout-modal__btn">Upload Picture</Button>
            </div>
          </Upload>
        </ImgCrop>
        <Button
          className="primary_border_btn main-layout-modal__btn"
          style={{ margin: "15px 0 0 0" }}
          onClick={microsoftFunc}
        >
          Link account to Microsoft
        </Button>
        <div className="d-flex-end select-modal__btns">
          {isEdit && (
            <>
              {" "}
              <Button onClick={() => setOpenProfile(false)} className="secondary_round_btn m-r">
                Cancel
              </Button>
              <Button onClick={handleSaveProfilePicture} className="primary_round_btn">
                Save
              </Button>
            </>
          )}
        </div>
      </div>
    );
  };
  return (
    <Layout>
      <Navigation setOpenProfile={setOpenProfile} />
      <div>
        {(window.innerWidth <= 1024 || (path.includes("case") && !path.includes("form"))) && (
          <Header setOpenProfile={setOpenProfile} />
        )}
        <Outlet />

        <div className="main-layout-modal__container">
          <CustomModal
            title="Profile Info"
            content={renderProfileInfo()}
            open={openProfile}
            onClose={() => setOpenProfile(false)}
          />
        </div>
      </div>
    </Layout>
  );
};
