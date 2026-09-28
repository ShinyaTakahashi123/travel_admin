// PlaceMasterForm(クライアントコンポーネント)とサーバーコンポーネント(new/page.tsx)の
// 両方から使うため、"use client"を付けない別ファイルにする("use client"のファイルの
// エクスポートは、サーバー側から関数として直接呼び出せないため)
export type PlaceMasterFormValue = {
  id?: string;
  name: string;
  reading: string;
  address: string;
  lat: string;
  lng: string;
  prefectureAreaId: string;
  category: string;
  isWideArea: boolean;
  isMemorial: boolean;
  stayDurationMin: string;
  websiteUrl: string;
  photoUrl: string;
  photoAuthor: string;
  photoLicense: string;
  photoLicenseUrl: string;
  photoSourceUrl: string;
  positionSource: string;
  aliases: string[];
};

export function emptyPlaceMasterForm(): PlaceMasterFormValue {
  return {
    name: "",
    reading: "",
    address: "",
    lat: "",
    lng: "",
    prefectureAreaId: "",
    category: "",
    isWideArea: false,
    isMemorial: false,
    stayDurationMin: "",
    websiteUrl: "",
    photoUrl: "",
    photoAuthor: "",
    photoLicense: "",
    photoLicenseUrl: "",
    photoSourceUrl: "",
    positionSource: "",
    aliases: [],
  };
}
