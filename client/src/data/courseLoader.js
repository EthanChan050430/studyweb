export async function loadCourseInfo(courseId) {
    try {
        // In a real modular system, we might fetch this from an API or use Vite dynamic imports
        const info = await import(`./courses/${courseId}/info.json`);
        return info.default;
    } catch (e) {
        console.error(`Failed to load course info for ${courseId}`, e);
        return null;
    }
}

export async function loadLessonMarkdown(courseId, lessonPath) {
    try {
        const response = await fetch(`/src/data/courses/${courseId}/lessons/${lessonPath}`);
        return await response.text();
    } catch (e) {
        console.error(`Failed to load lesson markdown for ${courseId}/${lessonPath}`, e);
        return '';
    }
}

export function parseMarkdownToSlides(markdown) {
    // Robust split for --- with any whitespace or line endings
    const rawSlides = markdown.split(/\r?\n\s*---\s*\r?\n/);
    return rawSlides.map(slide => {
        const lines = slide.split('\n');
        let title = '';
        let content = '';
        let experiment = null;

        // Very basic parsing for demo
        // Find first H1 or H2 as title
        const titleMatch = slide.match(/^(?:#|##)\s+(.*)$/m);
        let mainContent = slide;
        if (titleMatch) {
            title = titleMatch[1];
            mainContent = mainContent.replace(titleMatch[0], ''); // Remove the title line from content
        }

        // Identify experiment blocks
        const experimentRegex = /```experiment-(terminal|chat|rag)([\s\S]*?)```/g;
        let match;
        while ((match = experimentRegex.exec(slide)) !== null) {
            const type = match[1];
            try {
                const config = JSON.parse(match[2].trim());
                experiment = { type, ...config };
                mainContent = mainContent.replace(match[0], ''); // Remove from main content
            } catch (e) {
                console.error("Failed to parse experiment JSON", e);
            }
        }

        // Convert remaining markdown to HTML (using a simple placeholder or real markdown-it)
        // For now, we'll return the raw content to be rendered by the component
        return {
            title,
            content: mainContent.trim(),
            experiment
        };
    });
}
