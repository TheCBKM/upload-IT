import ipfs from '../ipfs';
import React, { Component } from 'react'

const accepts = [
    { name: "images", acc: "image/*", },
    { name: "audio", acc: "audio/*", },
    { name: "pdf", acc: "application/pdf,application/msword," }

]




export class index extends Component {
    state = {
        file: null,
        ipfsHash: null,
        fileformat: "null",
        fileLoaded: false,
        formatLoaded: false
    }

    captureChange = (event) => {
        console.log("caputreFile")
        event.preventDefault()
        const file = event.target.files[0]
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => {
            this.setState({
                file: Buffer(reader.result),
                fileLoaded: true
            })
            console.log('buffer', this.state.file)
        }
    }

    submit = async () => {
        event.preventDefault()
        console.log("onSubmit")
        ipfs.files.add(this.state.file, async (err, res) => {
            if (err) {
                console.error(err)
                console.log("error")
                return
            }

            await this.setState({
                ipfsHash: res[0].hash,
                fileLoaded: true,
                formatLoaded: false
            })
            console.log(res)
            console.log('ipfsHash', this.state)
        })
    }
    format = async (event) => {
        let value = event.target.value
        if (value == "Choose....") {
            await this.setState(
                {
                    formatLoaded: false

                }
            )
            return
        }

        let format = accepts.find(a => a.name == value).acc
        await this.setState({
            fileformat: format ? format : null,
            formatLoaded: true,
            file: null,
            ipfsHash: null,
            fileLoaded: false,

        })
        console.log(this.state)



    }
    render() {
        return (
            <div>
                <select onChange={this.format}>
                    <option>Choose....</option>
                    {
                        accepts.map(a =>
                            <option>{a.name}</option>
                        )
                    }
                </select><br />
                {this.state.formatLoaded ?
                    <div>
                        <input type="file" multiple onChange={this.captureChange} accept={this.state.fileformat} />
                        <br />

                        {this.state.fileLoaded ? <button onClick={this.submit}>Submit</button> : "Load file"}
                    </div>

                    : "Select format"}
                <br />
                {this.state.ipfsHash ? <div><a href={`https://ipfs.io/ipfs/${this.state.ipfsHash}`}>Link</a>
                    <br />
                    {this.state.fileformat == accepts[1].acc ?
                        <audio controls>
                            <source src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} type="audio/ogg" />
                            <source src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} type="audio/mpeg" />
                                Your browser does not support the audio element.
              </audio> :
                        this.state.fileformat == accepts[0].acc ?
                            <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} width="200" height="200" alt="Wait for image" />
                            :
                            this.state.fileformat == accepts[2].acc ?
                                <iframe src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`}></iframe>

                                : ""

                    }
                </div>
                    : "Upload some file"}

                <br />







            </div>
        )
    }
}

export default index


