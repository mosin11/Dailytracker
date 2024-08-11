import React,{ useState } from 'react'

export default function AddPlan() {

    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [category, setCategory] = useState('-1');

    const handleAddNote = () => {
        // Handle adding the note here
        console.log('Title:', title);
        console.log('Description:', desc);
        console.log('Category:', category);
        // Reset form fields
        setTitle('');
        setDesc('');
        setCategory('-1');
    };

    const handleClear =()=>{
        setTitle('');
        setDesc('');
        setCategory('-1');
    };


  return (
    <div className="d-flex align-items-center justify-content-center my-3">
    <div className="w-50">
        <div className="mb-3">
            <label htmlFor="noteTitle" className="form-label fw-bold">Title</label>
            <input type="text" className="form-control"
             value={title} onChange={(e)=> setTitle(e.target.value)}
             id="noteTitle" placeholder="enter your title" />
        </div>
        <div className="mb-3">
            <label htmlFor="description" className="form-label fw-bold">Description</label>
            <textarea className="form-control" 
             value={desc}
             onChange={(e) => setDesc(e.target.value)}
            id="description" placeholder="enter description" rows="4"></textarea>
        </div> 
        <div className="mb-3 w-50">
        <label htmlFor="category" className="form-label fw-bold">Category</label>
        <select className="form-select"
         value={category}
         onChange={(e)=>setCategory(e.target.value)}
        id="category">
            <option value="-1">-select-</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="urgent">Urgent</option>
            <option value="others">Others</option>
        </select>
    </div>
        <button type="button" onClick={handleAddNote} className="btn btn-primary">Add Notes</button>
        <button type="button" onClick={handleClear} className="btn btn-danger mx-3">Clear</button>
      
    </div>
</div>
  )
}
