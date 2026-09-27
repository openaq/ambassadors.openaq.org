---
name: true
active: true
jotformId: "262694814909168"
---
<script>
    const targetInput = document.getElementById('secure-input');

    // Intercept and stop the paste event
    targetInput.addEventListener('paste', (e) => {
        e.preventDefault();
        alert('Pasting is disabled for this field.');
    });

    // Intercept and stop the copy event
    targetInput.addEventListener('copy', (e) => {
        e.preventDefault();
        alert('Copying is disabled for this field.');
    });
</script>
