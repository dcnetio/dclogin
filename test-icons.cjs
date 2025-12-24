const icons = require('antd-mobile-icons');
console.log('CheckShieldOutline:', icons.CheckShieldOutline);

try {
  const CheckShieldOutlineEs = require('antd-mobile-icons/es/CheckShieldOutline');
  console.log('CheckShieldOutlineEs:', CheckShieldOutlineEs);
} catch (e) {
  console.log('ES import failed:', e.message);
}

try {
  const CheckShieldOutlineCjs = require('antd-mobile-icons/cjs/CheckShieldOutline');
  console.log('CheckShieldOutlineCjs:', CheckShieldOutlineCjs);
} catch (e) {
  console.log('CJS import failed:', e.message);
}
