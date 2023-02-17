import Image from 'next/image';
import ImageUploading from 'react-images-uploading';

function InputImage({ onChangeImage, images }) {
  const maxNumber = 69;
  return (
    <>
      <ImageUploading
        multiple
        value={images}
        onChange={onChangeImage}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({ imageList, onImageUpload, onImageUpdate, onImageRemove, isDragging, dragProps}) => (
          <div className="input-image">
            {imageList.length == 0 &&<button
              type="button"
              className="input-image__btn"
              onClick={onImageUpload}
              {...dragProps}
            >
              Bấm vào hoặc kéo thả ảnh vào đây
            </button>}
            {imageList.map((image, index) => (
              <div key={index} className="input-image__item">
                <Image
                  src={image['data_url'] || "/default.png"}
                  alt="cover image"
                  width={200}
                  height={150} />
                <div className="input-image__btns">
                  <button className="update" onClick={() => onImageUpdate(index)}>Đổi ảnh</button>
                  <button className="remove" onClick={() => onImageRemove(index)}>Xóa ảnh</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ImageUploading>
    </>
  )
}


export default InputImage