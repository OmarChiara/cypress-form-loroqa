import { faker } from '@faker-js/faker';

// Ignore known non-critical frontend errors (e.g., Google Maps autocomplete issues)
Cypress.on('uncaught:exception', (err) => {
  if (
    err.message.includes("address_components") || // Google Maps
    err.message.includes("U is undefined")        // Firefox issue
  ) {
    return false
  }
})

const genData = () => ({
  //Random data from faker library
  name: faker.person.fullName(),
  email: faker.internet.email(),
  phone: faker.phone.number('##########'),
  //Data given for the test
  country: 'United States',
  searchAddress: 'San Diego Sushi'
});

function selectDate(year, monthShort, day) {
  cy.get('.mat-calendar-period-button').click();
  cy.contains('.mat-calendar-body-cell-content', year).click();
  cy.contains('.mat-calendar-body-cell-content', monthShort).click();
  cy.contains('.mat-calendar-body-cell-content', day).click();
}

describe('LoroQA Form Submission', () => {
  it('fills form with dynamic data and proceeds to next step', () => {

    const data = genData()

    //Go to the URL to be tested
    cy.visit('https://loro:GDL2025@pulpo.loroqa.com/products/34/details')

    //Fill email and name(random data)
    cy.getByData('input-email').type(data.email).should('have.value', data.email)
    cy.getByData('input-insured-name').type(data.name).should('have.value', data.name)

    //Select Country "United States"
    cy.getByData('menu-options-input').type(data.country)
    cy.contains('US United States').click().wait(500)

    //Select state California
    cy.get('.mat-mdc-select-placeholder').click()
    cy.get('mat-option').contains('California').click()

    //Address autocomplete
    cy.getByData('address-autocomplete-input').type(data.searchAddress)
    cy.wait(1000)
    cy.getByData('address-autocomplete-input').type('{downarrow}{enter}')

    //Fill phone number(random data)
    cy.getByData('phone-input-number-input').click({ force: true }).type(data.phone, { force: true })
    cy.getByData('phone-input-number-input').invoke('val').should('match', /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)
    
    //Select Date: july 1st, 2025
    cy.get('mat-label.ng-tns-c3736059725-6').click()
    selectDate('2025', 'JUL', '1')

    //Submit form
    cy.get('[data-test="button-submit-form"] > .p-ripple').click()
  })
})
