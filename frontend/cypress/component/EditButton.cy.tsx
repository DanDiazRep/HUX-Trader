import { mount } from 'cypress/react'
import React from 'react'
import {EditButton} from '../../src/components/screens/home/EditButton'

describe('<EditButton>', () => {
  it('mounts', () => {
    mount(<EditButton action={()=> {}}/>)
    cy.get('button').should('include', SVGAElement)
    cy.get('button').should('have.css', 'background-color', 'rgb(240, 240, 240)')

    })
   
 
})