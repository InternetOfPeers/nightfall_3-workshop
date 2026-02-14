# Verification

nvm use 20

0.8.17 (london, optimized 1 run)
Utils       0x0116e2da40174423bc4cef3248523f0f7d47dc95           x
Verifier: 0x7690284054de635e8c27055875d2e200e46635b3             x
Poseidon: 0x6fb77259a306e0b4b8a1a5d835d7141fe969cefc                x
MerkleTree_Stateless 0x891daeb00ffdb8c34059f52b7d9125261a255c9d     x
ChallengesUtil  0xf3c91cc075e9c6e3044382813b803a2997d072f7      x
SimpleMultiSig  0x37d29cad699c6453298cb0cc5f68f1d38fc4ec3e          x
SanctionsListMock  0xa3145f02ae7a9cd26768197d3f3e73d2dee5f460   x
X509 0xad8c479148e8376efca2aa36fed5630318e015fb     x
Proposers 0x1bb99bb1d97f9cb8a310a8314c386dba9db33cd1        x
Challenges 0xba98b857ef86d4ba05d6a590b7ce022d9e929913       x
Shield 0x40134e54d5e58176f8000d51e23883c614182238       x

```shell
npx hardhat verify 0x0116e2da40174423bc4cef3248523f0f7d47dc95
```

Deployed by hardhat with the deployProxy method

0.8.20 (paris, optimized 200 run)
Challenges 0x257dd6a1d383cd6be06c1517c00aeac174a53fb9 TransparentUpgradeableProxy
    0xeb0982425f42b85b69b77004c6add023202262a5 ProxyAdmin
Proposers 0x180fd50c624434ca9912401947fb3d7485174d84 TransparentUpgradeableProxy
    0xafc5354e5315054058add4ba50505feb64a6d212 ProxyAdmin
Shield 0xb10A121791880cE9E481b6460Dd50AdB1B00217D TransparentUpgradeableProxy
    0x4368b965fe0bf0cba971f529f5fe9dfccdbfdc45 ProxyAdmin
State 0xe745a87d539b524c02487f45ae16fc8d0f79cbf9 TransparentUpgradeableProxy
    0xc9e6307ec3c651448a48f0940f629ebc9ce24f9c ProxyAdmin
X509 0x260521ff9cfc7bfdf7faaa32060dccac81277298 TransparentUpgradeableProxy
    0xd7feeffbd7d29cfabb3a398eaa03d6c6d6487d10 ProxyAdmin

I can't verify TransparentUpgradeableProxy and ProxyAdmin programmatically, so I use the trick of using custom ad-hoc JSON files (the contracts are always the same, only the parameters and address change, but not the bytecode).

```shell
 ./verify-contract 0xd7feeffbd7d29cfabb3a398eaa03d6c6d6487d10 ./utils/ProxyAdmin.json
```
