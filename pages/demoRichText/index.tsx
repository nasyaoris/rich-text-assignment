import TextEditor from "../../components/TextEditor"

const DemoRichText = () => {
    return (
        <div style={{ backgroundColor: "#FFFF", height: "100vh", display: "flex", justifyContent: "center"}}>
            <div style={{ border: "1px solid grey", width: "50%"}}>
            <TextEditor />
            </div>
        </div>
    )

}

export default DemoRichText;