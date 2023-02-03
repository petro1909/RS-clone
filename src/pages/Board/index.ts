class BoardPage {
  render(): void {
    document.title = 'Board Page';
    document.body.innerHTML = `
      <app-header></app-header>
      <h1>My boards</h1>
    `;
  }
}

export default BoardPage;
