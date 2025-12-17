const fs = require( 'fs' );
const path = require( 'path' );
const repoRoot = path.resolve( __dirname, '..', '..', '..' );

describe( 'Theme Template Validation', () => {
	const templatesDir = path.join( repoRoot, 'templates' );
	const partsDir = path.join( repoRoot, 'parts' );

	test( 'templates directory exists', () => {
		expect( fs.existsSync( templatesDir ) ).toBe( true );
	} );

	test( 'parts directory exists', () => {
		expect( fs.existsSync( partsDir ) ).toBe( true );
	} );

	describe( 'Required templates', () => {
		const requiredTemplates = [
			'index.html',
			'single.html',
			'page.html',
			'404.html',
		];

		requiredTemplates.forEach( ( template ) => {
			test( `${ template } exists`, () => {
				const templatePath = path.join( templatesDir, template );
				expect( fs.existsSync( templatePath ) ).toBe( true );
			} );

			test( `${ template } is valid HTML`, () => {
				const templatePath = path.join( templatesDir, template );
				const content = fs.readFileSync( templatePath, 'utf8' );
				expect( content ).toBeTruthy();
				expect( content.length ).toBeGreaterThan( 0 );
			} );
		} );
	} );

	describe( 'Template parts', () => {
		const requiredParts = [ 'header.html', 'footer.html' ];

		requiredParts.forEach( ( part ) => {
			test( `${ part } exists`, () => {
				const partPath = path.join( partsDir, part );
				expect( fs.existsSync( partPath ) ).toBe( true );
			} );

			test( `${ part } contains valid block markup`, () => {
				const partPath = path.join( partsDir, part );
				const content = fs.readFileSync( partPath, 'utf8' );
				expect( content ).toContain( '<!-- wp:' );
				expect( content ).toContain( '/-->' );
			} );
		} );
	} );

	describe( 'Block markup validation', () => {
		function getTemplateFiles( dir ) {
			if ( ! fs.existsSync( dir ) ) {
				return [];
			}
			return fs
				.readdirSync( dir )
				.filter( ( file ) => file.endsWith( '.html' ) )
				.map( ( file ) => path.join( dir, file ) );
		}

		const allTemplates = [
			...getTemplateFiles( templatesDir ),
			...getTemplateFiles( partsDir ),
		];

		allTemplates.forEach( ( templatePath ) => {
			const filename = path.basename( templatePath );

			test( `${ filename } has valid block comments`, () => {
				const content = fs.readFileSync( templatePath, 'utf8' );

				const openings = ( content.match( /<!-- wp:/g ) || [] ).length;
				const closings = ( content.match( /\/-->/g ) || [] ).length;

				expect( openings ).toBeGreaterThan( 0 );
				expect( closings ).toBeGreaterThan( 0 );
			} );

			test( `${ filename } includes template-part references correctly`, () => {
				const content = fs.readFileSync( templatePath, 'utf8' );
				const requiresTemplatePart = content.includes( 'template-part' );
				const templatePartValid =
					! requiresTemplatePart ||
					/<!-- wp:template-part.*"slug":/.test( content );
				expect( templatePartValid ).toBe( true );
			} );

			test( `${ filename } has proper semantic HTML`, () => {
				const content = fs.readFileSync( templatePath, 'utf8' );

				const needsMain =
					filename.includes( 'index' ) ||
					filename.includes( 'single' ) ||
					filename.includes( 'page' );
				const hasMain =
					content.includes( 'tagName":"main"' ) ||
					content.includes( '<main' );
				const mainValid = ! needsMain || hasMain;
				expect( mainValid ).toBe( true );

				const headerValid =
					filename !== 'header.html' || content.includes( 'header' );
				expect( headerValid ).toBe( true );

				const footerValid =
					filename !== 'footer.html' || content.includes( 'footer' );
				expect( footerValid ).toBe( true );
			} );
		} );
	} );

	describe( 'Accessibility checks', () => {
		function getTemplateFiles( dir ) {
			if ( ! fs.existsSync( dir ) ) {
				return [];
			}
			return fs
				.readdirSync( dir )
				.filter( ( file ) => file.endsWith( '.html' ) )
				.map( ( file ) => path.join( dir, file ) );
		}

		const allTemplates = [
			...getTemplateFiles( templatesDir ),
			...getTemplateFiles( partsDir ),
		];

		allTemplates.forEach( ( templatePath ) => {
			const filename = path.basename( templatePath );
			const content = fs.readFileSync( templatePath, 'utf8' );

			test( `${ filename } skip links have proper aria-hidden on spacers`, () => {
				const hasSpacers = ( content.match( /wp:spacer/g ) || [] ).length > 0;
				const skipLinkValid =
					! hasSpacers || content.includes( 'aria-hidden="true"' );
				expect( skipLinkValid ).toBe( true );
			} );

			test( `${ filename } images should have alt attributes or decorative markup`, () => {
				const hasImage = content.includes( 'wp:image' );
				const hasAltOrDecorative =
					content.includes( '"alt":' ) ||
					content.includes( 'role="presentation"' ) ||
					content.includes( 'aria-hidden="true"' );
				const imageAccessibilityValid =
					! hasImage || hasAltOrDecorative;
				expect( imageAccessibilityValid ).toBe( true );
			} );
		} );
	} );
} );
