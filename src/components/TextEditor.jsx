import React, { useState } from 'react';
import { Editor } from "@tinymce/tinymce-react";
import { Controller } from 'react-hook-form';










function TextEditor({control}) {
  return (

    <>

    <Controller
    name={ 'content'}
    control={control}
    render={({field:{onChange}})=>(

      <Editor
      apiKey="3ydwmu1v69ysn5e4pu1oxwmrdp4a02oj5sear5jwqxk5qh3w"
      initialValue="<p>Please Enter you content here</p>"
      init={{
        height: 500,
        menubar: false,
        plugins: [
          'advlist autolink lists link image',
          'charmap print preview anchor help',
          'searchreplace visualblocks code',
          'insertdatetime media table paste wordcount'
        ],
        toolbar:
          'undo redo | formatselect | bold italic | \
          alignleft aligncenter alignright | \
          bullist numlist outdent indent | \
          removeformat | help'
      }}
      onChange={onChange}
    />

    )} 
    
    />
   
    </>
  )
}

export default TextEditor