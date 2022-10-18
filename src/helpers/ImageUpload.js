import axios from "axios"

const ImageUpload = () => {

const uploadImage = async (event) => {
try {
    const formData = new FormData()
    formData.append('file', event.target.files[0])
    formData.append('upload_preset', 'djssiss0')
    const { data } = await axios.post('https://api.cloudinary.com/v1_1/danedskby/image/upload', formData).then((response) => {
      console.log(response)
  })
  } catch (error) {
    console.log(error.message)
  }
}

  return (
    <>
      <label htmlFor="image"> Upload Image</label>
      <input type="file" onChange={(event) => {
        uploadImage(event.target.files)
      }} />
    </>
  )
}

export default ImageUpload