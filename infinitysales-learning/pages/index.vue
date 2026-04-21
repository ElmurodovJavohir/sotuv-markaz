<script>
export default {
  middleware: 'auth_required',
  created() {
    this.$router.replace(this.localePath('/courses'))
  }
}
</script>
