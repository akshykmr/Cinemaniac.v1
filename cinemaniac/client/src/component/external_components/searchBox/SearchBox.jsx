import React from 'react'
import './SearchBox.scss'

const SearchBox = () => {
  return (
    <div className="form__group field">
    <input type="input" className="form__field" placeholder="Name" required=""/>
    <label for="name" className="form__label">Name</label>
</div>
  )
}

export default SearchBox
