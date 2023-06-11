import react from "react";
import { Button, TextField } from "@mui/material";
import "./form.css"

class Form extends react.Component{
    constructor(props){
        super(props);
        // for each item in props.fields, create an item in this.state.fields
        let fields = [];
        for (let i = 0; i < props.fields.length; i++) {
            fields.push(["", props.fields[i]]);
        }
        this.state = {
            fields: fields,
        }
    }

    handleChange = (event, index) => {
        let fields = this.state.fields;
        fields[index][0] = event.target.value;
        this.setState({fields: fields});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let fields = this.state.fields;
        let data = {};
        for (let i = 0; i < fields.length; i++) {
            data[fields[i][1]] = fields[i][0];
        }
        
        this.props.submit(data);
        this.props.close();
        
    }

    render(){
        return (
            <div className="form-appear">
                <div className="form-box">
                    <div className="inside">
                        <div>
                            <h3> {this.props.type} </h3>
                        </div>

                        <form onSubmit={this.handleSubmit}>
                            {this.state.fields.map((field, index) => {
                                return(
                                    <div>
                                        <TextField className="text-field"
                                            variant="standard" 
                                            key={"auth"+field[1]} 
                                            label={field[1]} 
                                            onChange={(event) => this.handleChange(event, index)}
                                        />
                                    </div>
                                );
                            })}
                            <div className="text-submit">
                                <input type="submit"></input>
                            </div>
                        </form>
                        <div className="cancel">
                            <div className="cancel-button" >
                            <Button onClick={this.props.close}> Cancel </Button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            
        );
    }
}

export default Form;