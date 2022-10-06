import React, { Component, useState } from "react";
import axios from 'axios';
import "../App.css";

const UrlComponent = ({setStatus}) => {
  let [isTrueVal, setTrueVal] = useState(true);
  let [selectedOption, setOption] = useState("NPM");
  let [url, setUrl] = useState("");

  let changeUrl = (event) => {
    let uri = event.target.value;
    setTrueVal(!uri || urlPatternValidation(uri))
    setUrl(uri);
  }

  let onValueChange = (event) => {
    setOption(event.target.value);
  }

  let onSubmit = (event) => {
    event.preventDefault();
    axios.post("http://localhost:8080/scan", {
        url,
        type: selectedOption,
      })
      .then(({ data }) => {
        setStatus("scanning", url);
      })
      .catch((err) => console.log(err));
  }

  let urlPatternValidation = (URL) => {
    const regex = new RegExp(
      "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
    );
    return regex.test(URL);
  };

  return (
      <form onSubmit={onSubmit} className="link-form">
        <input
          className="input-field"
          type="text"
          name="URL"
          value={url}
          onChange={changeUrl}
        />

        {!isTrueVal && (
          <div style={{ color: "#759EB8" }}>*URL is not valid</div>
        )}
        <div className="package-type">
          <label>
            <input
              type="radio"
              value="NPM"
              name="package"
              checked={selectedOption === "NPM"}
              onChange={onValueChange}
            />
            <span>Npm pkg/JS</span>
          </label>
          <label>
            <input
              type="radio"
              value="pypi"
              name="package"
              checked={selectedOption === "pypi"}
              onChange={onValueChange}
            />
            <span>Pypi pkg/Python</span>
          </label>
        </div>
        <button
          className="submit"
          onClick={onSubmit}
          disabled={!isTrueVal}
        >
          Start Scanning
        </button>
      </form>
    );
}

export default UrlComponent;
// class UrlComponent extends Component {
// constructor() {
//     super();
//     this.state = {
//       name: "React",
//     };
//     this.onValueChange = this.onValueChange.bind(this);
//     this.formSubmit = this.formSubmit.bind(this);
//   }

//   onValueChange(event) {
//     this.setState({
//       selectedOption: event.target.value,
//     });
//   }

//   formSubmit(event) {
//     event.preventDefault();
//     console.log(this.state.selectedOption);
//   }
//   state = {
//     URL: "",
//     isTrueVal: false,
//   };
//   urlPatternValidation = (URL) => {
//     const regex = new RegExp(
//       "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
//     );
//     return regex.test(URL);
//   };
//   changeUrl = (event) => {
//     const { value } = event.target;
//     const isTrueVal = !value || this.urlPatternValidation(value);
//     this.setState({
//       URL: value,
//       isTrueVal,
//     });
//   };
//   onSubmit = () => {
//     const { URL } = this.state;
//     console.log("Here is the site url: ", URL);
//   };
//   render() {
//     const { isTrueVal, URL } = this.state;
//     return (
//       <form onSubmit={this.formSubmit} className="link-form">
//         <input
//           className="input-field"
//           type="text"
//           name="URL"
//           value={URL}
//           onChange={this.changeUrl}
//         />

//         {!this.state.isTrueVal && (
//           <div style={{ color: "#759EB8" }}>*URL is not valid</div>
//         )}
//         <div className="package-type">
//           <label>
//             <input
//               type="radio"
//               value="NPM"
//               name="package"
//               checked={this.state.selectedOption === "NPM"}
//               onChange={this.onValueChange}
//             />
//             <span>Npm pkg/JS</span>
//           </label>
//           <label>
//             <input
//               type="radio"
//               value="pypi"
//               name="package"
//               checked={this.state.selectedOption === "pypi"}
//               onChange={this.onValueChange}
//             />
//             <span>Pypi pkg/Python</span>
//           </label>
//         </div>
//         <button
//           className="submit"
//           onClick={this.onSubmit}
//           disabled={!isTrueVal}
//         >
//           Start Scanning
//         </button>
//       </form>
//     );
//   }
// }
// export default UrlComponent;
