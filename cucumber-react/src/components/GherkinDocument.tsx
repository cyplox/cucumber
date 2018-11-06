import * as React from "react"
import styled from "styled-components"
// @ts-ignore
import * as Automerge from 'automerge'
import {io} from "cucumber-messages"
import Feature from "./gherkin/Feature"
import ExampleMap from "./examplemap/ExampleMap"
import {buildExampleMap, createFeature, IExampleMap} from "../examplemap/ExampleMap"
import IGherkinDocument = io.cucumber.messages.IGherkinDocument

const GherkinDocumentWrapper = styled.section`
  color: #113654;

  h1 {
    font-size: 24px;
  }
  h2 {
    font-size: 22px;
  }
  h3 {
    font-size: 18px;
  }
  h4 {
    font-size: 16px;
  }
  h5 {
    font-size: 12px;
  }
  h6 {
    font-size: 10px;
  }
  section {
    padding-left: 12pt;

    h1,
    h2,
    h3 {
      padding: 0;
      margin-top: 4pt;
      margin-bottom: 2pt;
    }
  }
`

export interface IGherkinDocumentProps {
  gherkinDocument?: IGherkinDocument | null
}

export const GherkinDocument: React.SFC<IGherkinDocumentProps> = ({gherkinDocument}) => {
  if (!gherkinDocument) {
    return <div>No gherkin doc</div>
  }
  if (!gherkinDocument.feature) {
    return <div>Empty Gherkin document :-(</div>
  }

  const exampleMap = Automerge.change(Automerge.init(), 'Initialize Example Map', (doc: IExampleMap) => {
    buildExampleMap(gherkinDocument.feature!, doc)
  })

  const exampleMapUpdated = (em: IExampleMap) => {
    const feature = createFeature(gherkinDocument.feature!, em)
    console.log("FEATURE", JSON.stringify(feature, null, 2))
  }

  return (
    <GherkinDocumentWrapper>
      <ExampleMap exampleMap={exampleMap} exampleMapUpdated={exampleMapUpdated}/>
      <Feature feature={gherkinDocument.feature}/>
    </GherkinDocumentWrapper>
  )
}

