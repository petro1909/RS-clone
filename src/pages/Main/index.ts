class MainPage {
  render(): void {
    document.title = 'Main Page';
    document.body.innerHTML = `
      <app-header></app-header>
      <h1>Hello! Main Page</h1>
      <auth-form></auth-form>
    `;
  }
}

export default MainPage;
