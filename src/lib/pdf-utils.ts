export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      throw new Error('PDF processing is only available in the browser')
    }

    // Use FileReader to read the PDF as array buffer
    const arrayBuffer = await file.arrayBuffer()
    
    // Dynamic import of PDF.js to avoid SSR issues
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.js')
    
    // Set worker source
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'
    
    // Load the PDF document
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer })
    const pdf = await loadingTask.promise
    
    let fullText = ''

    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ')
      
      fullText += pageText + '\n'
    }

    const extractedText = fullText.trim()
    
    // Validate that we extracted meaningful text
    if (!extractedText || extractedText.length < 50) {
      throw new Error('Unable to extract readable text from this PDF. The PDF may be image-based or encrypted.')
    }

    return extractedText
  } catch (error) {
    console.error('Error extracting text from PDF:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('readable text')) {
        throw error
      }
      if (error.message.includes('Invalid PDF')) {
        throw new Error('Invalid PDF file. Please ensure the file is not corrupted.')
      }
    }
    
    throw new Error('Failed to process PDF. Please try a different PDF file or ensure the file is text-based (not scanned images).')
  }
}

export function validatePDFFile(file: File): { isValid: boolean; error?: string } {
  if (!file) {
    return { isValid: false, error: 'No file provided' }
  }

  if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
    return { isValid: false, error: 'Please upload a PDF file only' }
  }

  // Check file size (limit to 10MB)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return { isValid: false, error: 'File size too large. Please upload a file smaller than 10MB.' }
  }

  return { isValid: true }
}